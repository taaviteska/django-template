# {{cookiecutter.project_title}}


## Project setup


**Create new database**

```
docker-compose run --rm -d --name {{ cookiecutter.repo_name }}_tmp postgres postgres

echo "CREATE DATABASE {{ cookiecutter.repo_name }};" | docker exec -i -u postgres {{ cookiecutter.repo_name }}_tmp psql
echo "CREATE USER {{ cookiecutter.repo_name }} WITH password '{{ cookiecutter.repo_name }}_password';" | docker exec -i -u postgres {{ cookiecutter.repo_name }}_tmp psql
echo "ALTER USER {{ cookiecutter.repo_name }} CREATEDB;" | docker exec -i -u postgres {{ cookiecutter.repo_name }}_tmp psql
echo "GRANT ALL PRIVILEGES ON DATABASE {{ cookiecutter.repo_name }} to {{ cookiecutter.repo_name }};" | docker exec -i -u postgres {{ cookiecutter.repo_name }}_tmp psql

docker-compose down
```


**Create local settings**

Create `{{ cookiecutter.repo_name }}/settings/local.py` from `{{ cookiecutter.repo_name }}/settings/local.py.example`

```
cp {{ cookiecutter.repo_name }}/settings/local.py.example {{ cookiecutter.repo_name }}/settings/local.py
```


**Resolve TODOs**

- Update {{ cookiecutter.repo_name }}/settings/local.py
- Search for `TODO` in all the files


## Running containers and commands


### Running containers in development

```
docker-compose up
docker-compose down && docker-compose build && docker-compose up -d && docker-compose logs -f
```


### Executing management commands

```
docker-compose run --rm django python manage.py migrate
docker-compose run --rm django python manage.py createsuperuser
docker-compose run --rm django python manage.py shell
```


### Running tests

```
docker-compose run --rm django python manage.py test
docker-compose run --rm node npm run test
```


### Linting tools

```
docker-compose run --rm django prospector
docker-compose run --rm node npm run lint
```
