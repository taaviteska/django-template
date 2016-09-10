# {{cookiecutter.project_title}}


## Project setup


**Create new database**

```
echo "CREATE DATABASE {{ cookiecutter.repo_name }};" | docker run -i --rm --net my_custom_network postgres psql -h service_postgres -U postgres
echo "CREATE USER {{ cookiecutter.repo_name }} WITH password '{{ cookiecutter.repo_name }}_password';" | docker run -i --rm --net my_custom_network postgres psql -h service_postgres -U postgres
echo "GRANT ALL PRIVILEGES ON DATABASE {{ cookiecutter.repo_name }} to {{ cookiecutter.repo_name }};" | docker run -i --rm --net my_custom_network postgres psql -h service_postgres -U postgres
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


**Running npm**

```
cd dir/to/django/root
npm install
npm run dev
```


**Creating a new container**

[https://docs.docker.com/engine/reference/commandline/run/](https://docs.docker.com/engine/reference/commandline/run/)

For production run the default command

```
docker run -d --net my_custom_network -v /dir/to/nginx_files_volume/{{ cookiecutter.repo_name }}:/files --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image
```

For local development

```
docker run -d --net my_custom_network -p 8000:8000 -v /dir/to/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }} -v /dir/to/nginx_files_volume/{{ cookiecutter.repo_name }}:/files --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image python manage.py runserver 0.0.0.0:8000
```

or to use gunicorn (remember to build and collect static files)

```
docker run -d --net my_custom_network -p 8000:8000 -v /dir/to/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}:/srv/{{ cookiecutter.repo_name }} -v /dir/to/nginx_files_volume/{{ cookiecutter.repo_name }}:/files --name {{ cookiecutter.repo_name }} {{ cookiecutter.repo_name }}_image /usr/local/bin/gunicorn {{ cookiecutter.repo_name }}.wsgi:application -b :8000 --reload
```


**Executing management commands**

[https://docs.docker.com/engine/reference/commandline/exec/](https://docs.docker.com/engine/reference/commandline/exec/)

```
docker exec {{ cookiecutter.repo_name }} python manage.py migrate
docker exec -it {{ cookiecutter.repo_name }} python manage.py createsuperuser
```
