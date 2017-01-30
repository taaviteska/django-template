from {{ cookiecutter.repo_name }}.celery import app as celery_app

__all__ = ['celery_app']
