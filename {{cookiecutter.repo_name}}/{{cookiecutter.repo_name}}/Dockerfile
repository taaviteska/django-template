# From https://github.com/docker-library/django/blob/819c332058c3638ab8f4fa5b9f70518e9aaf6325/3.4/Dockerfile

# Based on Python 3.5 image
FROM python:3.5

# Install system requirements
RUN apt-get update && apt-get install -y \
		gcc \
		gettext \
		postgresql-client libpq-dev \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

# Create a directory for the logs
RUN mkdir -p /var/log/{{ cookiecutter.repo_name }}

# Copy code
COPY . /srv/{{ cookiecutter.repo_name }}/

# Set the default directory where CMD will execute
WORKDIR /srv/{{ cookiecutter.repo_name }}

# Install Python requirements
RUN pip install -r ./requirements.txt

# Set the default command to execute when creating a new container
# Run gunicorn
CMD /usr/local/bin/gunicorn {{ cookiecutter.repo_name }}.wsgi:application -b :80
