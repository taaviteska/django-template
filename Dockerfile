# From https://github.com/docker-library/django/blob/819c332058c3638ab8f4fa5b9f70518e9aaf6325/3.4/Dockerfile

# Based on Python 3.4 image
FROM python:3.4-slim

# Install system requirements
RUN apt-get update && apt-get install -y \
		gcc \
		gettext \
		postgresql-client libpq-dev \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy the application folder inside the container
ADD /mysite /srv/mysite/mysite

# Copy the requirements
ADD requirements.txt /srv/mysite/requirements.txt

# Install Python requirements
RUN pip install -r /srv/mysite/requirements.txt

# Expose ports
EXPOSE 8000

# Set the default directory where CMD will execute
WORKDIR /srv/mysite/mysite

# Set the default command to execute when creating a new container
# Run gunicorn
CMD /usr/local/bin/gunicorn mysite.wsgi:application -w 2 -b :8000
