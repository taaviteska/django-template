from settings.staging import *


SITE_URL = 'https://{{cookiecutter.repo_name}}.TODO'
ALLOWED_HOSTS = ['{{cookiecutter.repo_name}}.TODO']

EMAIL_BACKEND = 'sparkpost.django.email_backend.SparkPostEmailBackend'
