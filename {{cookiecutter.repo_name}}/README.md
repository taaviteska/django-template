# {{cookiecutter.project_title}}


## Project setup


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
