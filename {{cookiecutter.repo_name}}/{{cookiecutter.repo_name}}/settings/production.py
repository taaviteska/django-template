from settings.staging import *


ALLOWED_HOSTS = ['{{cookiecutter.repo_name}}.TODO']

EMAIL_BACKEND = 'sparkpost.django.email_backend.SparkPostEmailBackend'
