FROM python:3.5.2-slim

# Install system requirements
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends gcc gettext libpq-dev && \
	rm -rf /var/lib/apt/lists/*

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
CMD /usr/local/bin/gunicorn {{ cookiecutter.repo_name }}.wsgi:application --workers 2 --bind :80
