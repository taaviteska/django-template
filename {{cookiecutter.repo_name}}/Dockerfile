# From https://github.com/docker-library/django/blob/819c332058c3638ab8f4fa5b9f70518e9aaf6325/3.4/Dockerfile

# Based on Thorgate's Python 3.4 image
FROM thorgate/python3.4

# Install system requirements
RUN apt-get update && apt-get install -y \
		gcc \
		gettext \
		postgresql-client libpq-dev \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy the requirements
COPY requirements.txt /srv/{{ cookiecutter.repo_name }}/requirements.txt

# Install Python requirements
RUN pip install -r /srv/{{ cookiecutter.repo_name }}/requirements.txt

# Set the default directory where CMD will execute
WORKDIR /srv/{{ cookiecutter.repo_name }}/{{ cookiecutter.repo_name }}

# Set the default command to execute when creating a new container
# Run gunicorn
CMD /usr/local/bin/gunicorn {{ cookiecutter.repo_name }}.wsgi:application -b :80
