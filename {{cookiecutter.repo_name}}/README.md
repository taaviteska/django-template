# Django template with Docker

## Usage

TODO

## Docker setup

**Building Docker image**

[https://docs.docker.com/engine/reference/commandline/build/](https://docs.docker.com/engine/reference/commandline/build/)

```
cd dir/to/{{ cookiecutter.repo_name }}
docker build -t {{ cookiecutter.repo_name }}_image .
```

**Creating a new container**

[https://docs.docker.com/engine/reference/commandline/run/](https://docs.docker.com/engine/reference/commandline/run/)

For production run the default command

```
docker run -d -p 80:8000 --link service_postgres:service_postgres -v /Users/taaviteska/Python/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }} --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image
```

For local development

```
docker run -d -p 80:8000 --link service_postgres:service_postgres -v /Users/taaviteska/Python/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }} --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image /usr/local/bin/gunicorn {{ cookiecutter.repo_name }}.wsgi:application -w 2 -b :8000 --reload
```

## Database setup

**Create new database**

```
echo "CREATE DATABASE {{ cookiecutter.repo_name }};" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
echo "CREATE USER {{ cookiecutter.repo_name }} WITH password '{{ cookiecutter.repo_name }}_password';" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
echo "GRANT ALL PRIVILEGES ON DATABASE {{ cookiecutter.repo_name }} to {{ cookiecutter.repo_name }};" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
```

## Project setup

**Executing a command (migrate)**

[https://docs.docker.com/engine/reference/commandline/exec/](https://docs.docker.com/engine/reference/commandline/exec/)

```
docker exec {{ cookiecutter.repo_name }} python manage.py migrate
```
