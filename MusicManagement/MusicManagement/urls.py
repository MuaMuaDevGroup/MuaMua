"""MusicManagement URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from music.views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/account/login/', AccountLoginView.as_view()),
    path('api/account/logout/', AccountLogoutView.as_view()),
    path('api/account/password/', AccountChangePasswordView.as_view()),
    path('api/account/', AccountDetailView.as_view()),
    path('api/music/', MusicView.as_view()),
    path('api/artist/', ArtistView.as_view()),
    path('api/artist/<int:pk>/', ArtistDetailView.as_view()),
    path('api/album/', AlbumView.as_view()),
    path('api/album/<int:pk>/', AlbumDetailView.as_view()),
    path('web/', TemplateView.as_view(template_name="index.html")),
    path('web/manage/', TemplateView.as_view(template_name="music_manage.html")),
]
