# Django project template built on Docker


## Usage

To use this template, first ensure that you have
[Cookiecutter](http://cookiecutter.readthedocs.org/en/latest/readme.html) available. 
If not, you can install it from pip: `pip install cookiecutter`.

Then just execute:
    
    cookiecutter dir/to/django-template/

It will ask you a few questions, e.g. project's name.

After generation completes, search for any TODOs in the code and make appropriate changes where needed.

See README.md in the generated project for instructions on how to set up your development environment.

## TODOs

- When setting up the server, postgres is not able to set up itself so fast and database creation always fails
- Add PyCharm template (.idea/)
- Improve require() in the fabric tasks
- Improve fabfile documentation (What should be available on the server already? Server specs?)
- Describe used packages (Python and Node)
- Make Sparkpost optional?
