# {{cookiecutter.project_title}}


## Project setup


**Create new database**

```
echo "CREATE DATABASE {{ cookiecutter.repo_name }};" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
echo "CREATE USER {{ cookiecutter.repo_name }} WITH password '{{ cookiecutter.repo_name }}_password';" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
echo "GRANT ALL PRIVILEGES ON DATABASE {{ cookiecutter.repo_name }} to {{ cookiecutter.repo_name }};" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
```


**Building Docker image for {{cookiecutter.project_title}}**

[https://docs.docker.com/engine/reference/commandline/build/](https://docs.docker.com/engine/reference/commandline/build/)

```
cd dir/to/{{ cookiecutter.repo_name }}
docker build -t {{ cookiecutter.repo_name }}_image .
```


**Switch to internal {{ cookiecutter.repo_name }} dir**

```
cd {{ cookiecutter.repo_name }}
```


**Create local settings**

Create `settings/local.py` from `settings/local.py.example`

```
cp settings/local.py.example settings/local.py
```


**Resolve TODOs**

- Update settings/local.py
- Search for `TODO` in all the files


**Creating a new container**

[https://docs.docker.com/engine/reference/commandline/run/](https://docs.docker.com/engine/reference/commandline/run/)

For production run the default command

```
docker run -d --net my_custom_network -v /dir/to/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }} --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image
```

For local development

```
docker run -d --net my_custom_network -v /dir/to/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }} --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image python manage.py runserver 0.0.0.0:80
```

or to use gunicorn (requires _manage.py collectstatic_ for static files to be found)

```
docker run -d --net my_custom_network -v /dir/to/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }} --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image /usr/local/bin/gunicorn {{ cookiecutter.repo_name }}.wsgi:application -b :80 --reload
```


**Executing management commands**

[https://docs.docker.com/engine/reference/commandline/exec/](https://docs.docker.com/engine/reference/commandline/exec/)

```
docker exec {{ cookiecutter.repo_name }} python manage.py migrate
docker exec -it {{ cookiecutter.repo_name }} python manage.py createsuperuser
```
