# Introduction 
MuaMua is a course project for JNU's Principle of Database System(08060113,201912273)

Imported from Azure DevOps

# Getting Started
##	Installation process

First restore packages and compile frontend with Webpack:

    cd ./MusicManagement
    python -m pip install -r ./requirements.txt
    cd ./MusicManagement/frontend
    npm install
    npm run-script debug

Then debug project by Django internal web server:

    python ./manage.py runserver --settings=MusicManagement.settings --configuration=Development

##	Software dependencies

### Tools

- Python3
- NPM

### Libraries

#### Web frontend

- AngularJS
- Bootstrap4
- Webpack

#### Web backend

- Django
- Django REST Framework
- Django Simple Captcha
- pyODBC