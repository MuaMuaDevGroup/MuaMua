# 简介
本项目为暨南大学2018年秋季《数据库系统原理(08060113,201912273)》大作业

原项目托管于Azure DevOps

# 开始
##	安装

首先还原项目使用的包并调用Webpack打包:

    cd ./MusicManagement
    python -m pip install -r ./requirements.txt
    cd ./MusicManagement/frontend
    npm install
    npm run-script debug

然后执行下列命令使用Django内置Web服务器进行调试:

    python ./manage.py runserver --settings=MusicManagement.settings --configuration=Development

##	依赖

### 工具

- Python3
- NPM

### 库

#### Web前端

- AngularJS
- Bootstrap4
- Webpack

#### Web后端

- Django
- Django REST Framework
- Django Simple Captcha
- pyODBC