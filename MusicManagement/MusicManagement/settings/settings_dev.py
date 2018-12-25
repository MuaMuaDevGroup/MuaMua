from .settings_base import Base
import os

class Development(Base):

    # SECURITY WARNING: don't run with debug turned on in production!
    DEBUG = True


    # Database
    # https://docs.djangoproject.com/en/2.1/ref/settings/#databases

    DATABASES = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'MusicManagement',
            'USER': '',
            'PASSWORD': '',
            'HOST': 'localhost',
            'PORT': '',

            'OPTIONS': {
                'driver': 'ODBC Driver 13 for SQL Server',
            },
        },
    }


    # Media files
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(Base.BASE_DIR, "frontend/media")

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/2.1/howto/static-files/

    STATIC_URL = '/dist/'
    # Add for vuejs
    STATICFILES_DIRS = [
        os.path.join(Base.BASE_DIR, "frontend/dist"),
    ]
