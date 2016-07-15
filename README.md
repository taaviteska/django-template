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

```
docker run -d -p 80:8000 --link postgres:postgres --name mysite mysite_image
```

## Database setup

**Create new database**

```
echo "CREATE DATABASE mysite;" | docker run -i --rm --link postgres:postgres postgres psql -h postgres -U postgres
echo "CREATE USER mysite WITH password 'mysite_password';" | docker run -i --rm --link postgres:postgres postgres psql -h postgres -U postgres
echo "GRANT ALL PRIVILEGES ON DATABASE mysite to mysite;" | docker run -i --rm --link postgres:postgres postgres psql -h postgres -U postgres
```

## Project setup

**Executing a command (migrate)**

[https://docs.docker.com/engine/reference/commandline/exec/](https://docs.docker.com/engine/reference/commandline/exec/)

```
docker exec mysite python manage.py migrate
```
