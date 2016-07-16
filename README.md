# Django template with Docker

## Usage

TODO

## Docker setup

**Building Docker image**

[https://docs.docker.com/engine/reference/commandline/build/](https://docs.docker.com/engine/reference/commandline/build/)

```
cd docker-django-template
docker build -t mysite_image .
```

**Creating a new container**

[https://docs.docker.com/engine/reference/commandline/run/](https://docs.docker.com/engine/reference/commandline/run/)

For production run the default command

```
docker run -d -p 80:8000 --link service_postgres:service_postgres -v /Users/taaviteska/Docker/django-template/mysite:/srv/mysite/mysite --name mysite mysite_image
```

For local development

```
docker run -d -p 80:8000 --link service_postgres:service_postgres -v /Users/taaviteska/Docker/django-template/mysite:/srv/mysite/mysite --name mysite mysite_image /usr/local/bin/gunicorn mysite.wsgi:application -w 2 -b :8000 --reload
```

## Database setup

**Create new database**

```
echo "CREATE DATABASE mysite;" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
echo "CREATE USER mysite WITH password 'mysite_password';" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
echo "GRANT ALL PRIVILEGES ON DATABASE mysite to mysite;" | docker run -i --rm --link service_postgres:postgres postgres psql -h postgres -U postgres
```

## Project setup

**Executing a command (migrate)**

[https://docs.docker.com/engine/reference/commandline/exec/](https://docs.docker.com/engine/reference/commandline/exec/)

```
docker exec mysite python manage.py migrate
```
