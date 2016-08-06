import os
import random
from StringIO import StringIO

from fabric import colors
from fabric.contrib.console import confirm
from fabric.context_managers import cd
from fabric.decorators import task
from fabric.operations import abort, prompt, put, require, sudo
from fabric.state import env
from fabric.utils import indent

from hammer import __version__ as hammer_version

# Ensure that we have expected version of the tg-hammer package installed
assert hammer_version.startswith('0.2.'), "tg-hammer 0.2 is required"

from hammer.vcs import Vcs

vcs = Vcs.init(project_root=os.path.dirname(os.path.dirname(__file__)), use_sudo=True)

# Use  .ssh/config  so that you can use hosts defined there.
env.use_ssh_config = True

# TODO
# tg-hammer !?
# Improve imports
# Check require()
# Documentation


""" TARGETS """


def defaults():
    env.code_dir = '/srv/{{cookiecutter.repo_name}}'

    # Docker
    env.docker_network = 'my-TODO-network'
    env.docker_image = '{{cookiecutter.repo_name}}_image'
    env.docker_container = '{{cookiecutter.repo_name}}'

    # Nginx
    env.nginx_image = 'image_service_nginx'
    env.nginx_container = 'service_nginx'
    env.nginx_volume_path = '/volumes/docker-nginx'

    # PostgreSQL
    env.postgres_service = 'service_postgres'


@task(alias="staging")
def test():
    defaults()
    env.target = 'staging'
    env.hosts = ['test.{{cookiecutter.repo_name}}.TODO']


@task(alias="production")
def live():
    defaults()
    env.target = 'production'
    env.hosts = ['{{cookiecutter.repo_name}}.TODO']


""" SERVER SETUP """


@task
def setup_server():
    """ Perform initial deploy on the target """

    # Clone code repository
    vcs.clone()

    # Create password for DB, secret key and the local settings
    sparkpost_key = prompt("Sparkpost API key: ")
    db_password = generate_password()
    secret_key = generate_password()
    local_settings = """from settings.{target} import *

SECRET_KEY = '{secret_key}'

SPARKPOST_API_KEY = '{sparkpost_key}'

# Add proper database name, user and password here, if necessary
DATABASES = {% raw %}{{{% endraw %}
    'default': {% raw %}{{{% endraw %}
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': 'service_postgres',
        'NAME': '{{ cookiecutter.repo_name }}',
        'USER': '{{ cookiecutter.repo_name }}',
        'PASSWORD': '{db_password}',
    {% raw %}}}{% endraw %}
{% raw %}}}{% endraw %}
""".format(target=env.target, secret_key=secret_key, db_password=db_password, sparkpost_key=sparkpost_key)

    # Create local settings
    put(local_path=StringIO(local_settings), remote_path=env.code_dir + '/{{cookiecutter.repo_name}}/settings/local.py',
        use_sudo=True)

    # Create database
    sudo(
        'echo "CREATE DATABASE {{ cookiecutter.repo_name }};"'
        ' | docker run -i --rm --network {network} postgres psql -h {postgres_service} -U postgres'.format(
            network=env.docker_network,
            postgres_service=env.postgres_service,
        )
    )
    sudo(
        'echo "CREATE USER {{ cookiecutter.repo_name }} WITH password \'{db_password}\';"'
        ' | docker run -i --rm --network {network} postgres psql -h {postgres_service} -U postgres'.format(
            db_password=db_password,
            network=env.docker_network,
            postgres_service=env.postgres_service,
        )
    )
    sudo(
        'echo "CREATE DATABASE {{ cookiecutter.repo_name }};"'
        ' | docker run -i --rm --network {network} postgres psql -h {postgres_service} -U postgres'.format(
            network=env.docker_network,
            postgres_service=env.postgres_service,
        )
    )

    # Start container
    start_container()

    # migrations, collectstatic
    migrate()
    collectstatic()

    # Install nginx config and restart the service
    nginx_update()

    # Run deploy systemchecks
    check()


@task
def nginx_update():
    sudo('cp {code_dir}/nginx.conf {volume_path}/{{cookiecutter.repo_name}}'.format(
        code_dir=env.code_dir,
        volume_path=env.nginx_volume_path,
    ))

    # Restart nginx
    sudo('docker stop {container_name}'.format(container_name=env.nginx_container))
    sudo('docker start {container_name}'.format(container_name=env.nginx_container))


""" FUNCTIONS """


@task
def show_log(commit_id=None):
    """ List revisions to apply/unapply when updating to given revision.
        When no revision is given, it default to the head of current branch.
        Returns False when there is nothing to apply/unapply. otherwise revset of revisions that will be applied or
        unapplied (this can be passed to `hg|git status` to see which files changed for example).
    """
    result = vcs.deployment_list(commit_id)

    if 'message' in result:
        print(result['message'])
        return False

    elif 'forwards' in result:
        print("Revisions to apply:")
        print(indent(result['forwards']))

    elif 'backwards' in result:
        print("Revisions to rollback:")
        print(indent(result['backwards']))

    return result['revset']


@task
def migrate_diff(id=None, revset=None, silent=False):
    """ Check for migrations needed when updating to the given revision. """
    require('code_dir')

    # Exactly one of id and revset must be given
    assert (id or revset) and not (id and revset)

    # no revset given, calculate it by using deployment_list
    if not revset:
        result = vcs.deployment_list(id)

        if 'revset' not in result:
            print(result['message'])
            abort('Nothing to do')

        else:
            revset = result['revset']

    # Pull out migrations
    migrations = vcs.changed_files(revset, "\/(?P<model>\w+)\/migrations\/(?P<migration>.+)")

    if not silent and migrations:
        print "Found %d migrations." % len(migrations)
        print indent(migrations)

    return migrations


@task
def version():
    """ Get current target version hash. """
    require('hosts')
    require('code_dir')

    commit_id, branch, message, author = vcs.version()
    summary = "%s [%s]: %s - %s" % (commit_id, branch, message, author)
    print colors.yellow(summary)


@task
def deploy(id=None):
    """ Perform an automatic deploy to the target requested. """

    # Ask for sudo at the beginning so we don't fail during deployment because of wrong pass
    if not sudo('whoami'):
        abort('Failed to elevate to root')
        return

    # Show log of changes, return if nothing to do
    revset = show_log(id)
    if not revset:
        return

    # See if we have any changes to migrations between the revisions we're applying
    migrations = migrate_diff(revset=revset, silent=True)
    if migrations:
        print colors.yellow("Will apply %d migrations:" % len(migrations))
        print indent(migrations)

    # see if nginx conf has changed
    nginx_changed = vcs.changed_files(revset, [r' nginx.conf'])
    if nginx_changed:
        print colors.yellow("Nginx configuration change detected, updating automatically")

    request_confirm("deploy")

    vcs.update(id)
    restart_container()

    if migrations:
        migrate()

    if nginx_changed:
        nginx_update()

    collectstatic()

    # Run deploy systemchecks
    check()


""" CONTAINER TASKS """


@task
def stop_container():
    sudo('docker stop {docker_container}'.format(
        docker_container=env.docker_container,
    ))
    sudo('docker rm {docker_container}'.format(
        docker_container=env.docker_container,
    ))


@task
def start_container():
    # Build Docker image
    with cd(env.code_dir):
        sudo('docker build -t {docker_image} .'.format(docker_image=env.docker_image))

    sudo(
        'docker run -d --net {docker_network} -v {volume} --name {docker_container} {docker_image}'.format(
            docker_network=env.docker_network,
            volume="{}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }}".format(env.code_dir),
            docker_image=env.docker_image,
            docker_container=env.docker_container,
        )
    )


@task
def restart_container():
    stop_container()
    start_container()


@task
def logs(tail=25):
    """ Show container logs. """

    sudo(
        'docker logs --tail {tail} {docker_container}'.format(
            tail=tail,
            docker_container=env.docker_container,
        ),
    )


""" MANAGEMENT COMMANDS """


@task
def docker_exec(cmd, options=''):
    """ Execute a command on Docker container. """

    sudo(
        'docker exec {options} {docker_container} {cmd}'.format(
            options=options,
            docker_container=env.docker_container,
            cmd=cmd,
        ),
    )


@task
def management_cmd(cmd, options=''):
    """ Perform a management command on the target. """
    docker_exec(
        'python manage.py {cmd}'.format(
            cmd=cmd,
        ),
        options=options,
    )


@task
def migrate():
    """ Preform migrations on the database. """
    management_cmd("migrate --noinput")


@task
def check():
    """ Perform Django's deploy systemchecks. """
    management_cmd('check --deploy')


@task
def createsuperuser():
    """ Create new superuser in Django. """
    management_cmd('createsuperuser', options='-it')


@task
def collectstatic():
    """ Collect static files. """
    management_cmd('collectstatic --noinput')


""" HELPERS """


def request_confirm(action):
    if not confirm("Are you sure you want to run task: %s on servers %s?" % (action, env.hosts)):
        abort('Deployment aborted.')


def generate_password(length=64):
    chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#%^&*(-_=+)'
    return ''.join(random.SystemRandom().choice(chars) for _ in range(length))
