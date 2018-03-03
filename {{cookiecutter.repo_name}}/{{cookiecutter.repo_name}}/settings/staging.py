from settings.base import *


DEBUG = False

SITE_URL = 'https://test.{{cookiecutter.repo_name}}.TODO'
ALLOWED_HOSTS = ['test.{{cookiecutter.repo_name}}.TODO']

LOGGING['handlers'] = {
    'access_log': {
        'class': 'logging.FileHandler',
        'level': 'INFO',
        'filename': '/var/log/{{cookiecutter.repo_name}}/info.log',
        'formatter': 'default',
    },
    'error_log': {
        'class': 'logging.FileHandler',
        'level': 'ERROR',
        'filename': '/var/log/{{cookiecutter.repo_name}}/error.log',
        'formatter': 'default',
    },
    'mail_admins': {
        'level': 'ERROR',
        'filters': ['require_debug_false'],
        'class': 'django.utils.log.AdminEmailHandler',
        'formatter': 'default',
    }
}
LOGGING['loggers'][''] = {
    'handlers': ['access_log', 'error_log', 'mail_admins'],
    'level': 'INFO',
    'filters': ['require_debug_false'],
}
