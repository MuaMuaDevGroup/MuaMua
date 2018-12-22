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
import os

from django.contrib import admin
from django.urls import path
from music.views import *
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/account/login/', AccountLoginView.as_view()),
    path('api/account/logout/', AccountLogoutView.as_view()),
    path('api/account/password/', AccountChangePasswordView.as_view()),
    path('api/account/', AccountDetailView.as_view()),
    path('api/music/', MusicView.as_view()),
    path('api/music/<int:pk>/', MusicDetailView.as_view()),
    path('api/music/<int:pk>/file/', MusicDetailUploadView.as_view()),
    path('api/artist/', ArtistView.as_view()),
    path('api/artist/<int:pk>/', ArtistDetailView.as_view()),
    path('api/artist/<int:pk>/photo/', ArtistPhotoUploadView.as_view()),
    path('api/album/', AlbumView.as_view()),
    path('api/album/<int:pk>/', AlbumDetailView.as_view()),
    path('api/album/<int:pk>/cover/', AlbumCoverUploadView.as_view()),
    path('api/user/', UserView.as_view()),
    path('api/user/<int:pk>/', UserDetailView.as_view()),
    path('api/user/<int:pk>/password/', UserDetailChangePasswordView.as_view()),
    path('api/playlist/', PlaylistView.as_view()),
    path('api/playlist/<int:pk>/', PlaylistDetailView.as_view()),
    path('api/playlist/<int:pk>/cover/', PlaylistPhotoUploadView.as_view()),
    path('api/playlist/<int:pk>/collector/',
         PlaylistDetailOwnershipView.as_view()),
    path('web/', TemplateView.as_view(template_name="index.html")),
    path('web/manage/', TemplateView.as_view(template_name="music_manage.html")),
    path('web/music/', TemplateView.as_view(template_name="music.html")),
    path('api/comment/', CommentListView.as_view()),
    path('api/comment/<int:pk>/', CommentDetailView.as_view()),
    path('api/comment/my/', CommentUserView.as_view()),
    path('api/comment/my/<int:pk>/', CommentDetailUserView.as_view()),
    path('api/recommend/', RecommendView.as_view()),
    path('api/recommend/<int:pk>/', RecommendUpdateView.as_view()),
    path('api/recommend/today/', RecommendUserView.as_view()),
    path('api/recommend/music/', RecommendMusicView.as_view()),
    path('api/recommend/album/', RecommendAlbumView.as_view()),
    path('api/recommend/playlist/', RecommendPlaylistView.as_view()),
    path('api/playlist/my/', PlaylistUserView.as_view()),
    path('api/playlist/my/<int:pk>/', PlaylistDetailUserView.as_view()),
    path('api/playlist/my/collection/', PlaylistCollectionView.as_view()),
    path('api/playlist/my/collection/<int:pk>/',
         PlaylistCollectionDeleteView.as_view()),
    path('api/playlist/my/<int:pk>/cover/',
         PlaylistUserPhotoUploadView.as_view()),
    path('api/music/favorite/', FavoriteView.as_view()),
    path('api/music/favorite/<int:pk>/', FavoriteDetailView.as_view()),
]

if os.environ.get("DJANGO_CONFIGURATION") == "Development":
    urlpatterns = urlpatterns + \
        static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
