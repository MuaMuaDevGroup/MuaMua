from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from music.serializers import PlaylistCreationSerializer, PlaylistDetailSerializer, PlaylistOwnersAddSerializer, PlayListOwnersDeleteSerializer, PlayListOwnersDetailSerializer, PlaylistSerializer, PlaylistUpdateSerializer, PlaylistUserCreationSerializer, FavoriteMusicSerializer, PlaylistUserCollectionSerializer, PlaylistUserUpdateSerializer, MusicDetailSerializer
from music.models import Music, Album, Artist, Playlist
from music.permissions import IsAdminOrReadOnly
import os
import hashlib


class PlaylistView(ListAPIView):

    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    search_fields = ('name',)
    permission_classes = (IsAdminOrReadOnly,)

    def post(self, request, format=None):
        serializer = PlaylistCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlaylistDetailView(APIView):

    permission_classes = (IsAdminOrReadOnly,)

    def get(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PlaylistDetailSerializer(playlists.get(pk=pk))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = playlists.get(pk=pk)
        serializer = PlaylistUpdateSerializer(playlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = playlists.get(pk=pk)
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaylistDetailOwnershipView(APIView):

    permission_classes = (IsAdminOrReadOnly,)

    def get(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PlayListOwnersDetailSerializer(
            playlists.get(pk=pk))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PlaylistOwnersAddSerializer(
            playlists.get(pk=pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PlayListOwnersDeleteSerializer(
            playlists.get(pk=pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlaylistPhotoUploadView(APIView):

    parser_classes = (MultiPartParser,)
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = playlists.get(pk=pk)
        file_object = request.FILES["file"]
        # Hash filename
        hasher = hashlib.md5()
        file_name, file_ext = os.path.splitext(file_object.name)
        hasher.update(str(pk).encode())
        file_name = hasher.hexdigest()
        file_object.name = "{0}{1}".format(file_name, file_ext)
        if playlist.cover != None:
            playlist.cover.delete()
        playlist.cover = file_object
        playlist.save()
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = playlists.get(pk=pk)
        if playlist.cover != None:
            playlist.cover.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaylistUserView(ListAPIView):
    serializer_class = PlaylistSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    SearchFilter = ('name')
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        user = self.request.user
        return Playlist.objects.filter(owner=user)

    def post(self, request, format=None):
        serializer = PlaylistUserCreationSerializer(data=request.data)
        if serializer.is_valid():
            playlist = Playlist()
            playlist.name = serializer.validated_data["name"]
            playlist.description = serializer.validated_data["description"]
            playlist.owner = request.user
            playlist.play_count = 0
            playlist.save()
            playlist.songs.set(serializer.validated_data["songs"])
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlaylistDetailUserView(RetrieveAPIView):
    serializer_class = PlaylistDetailSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = ()

    def get_queryset(self):
        user = self.request.user
        return Playlist.objects.filter(owner=user)

    def put(self, request, pk, format=None):
        if len(Playlist.objects.filter(pk=pk)) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = Playlist.objects.get(pk=pk)
        if playlist.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = PlaylistUserUpdateSerializer(playlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = playlists.get(pk=pk)
        if playlist.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaylistUserPhotoUploadView(APIView):

    parser_classes = (MultiPartParser,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk, format=None):
        playlists = Playlist.objects.filter(pk=pk)
        if len(playlists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = playlists.get(pk=pk)
        if playlist.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        file_object = request.FILES["file"]
        # Hash filename
        hasher = hashlib.md5()
        file_name, file_ext = os.path.splitext(file_object.name)
        hasher.update(str(pk).encode())
        file_name = hasher.hexdigest()
        file_object.name = "{0}{1}".format(file_name, file_ext)
        if playlist.cover != None:
            playlist.cover.delete()
        playlist.cover = file_object
        playlist.save()
        return Response(status=status.HTTP_201_CREATED)


class PlaylistCollectionView(ListAPIView):
    serializer_class = PlaylistSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    SearchFilter = ('name')
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Playlist.objects.filter(collectors=user)

    def post(self, request, format=None):
        serializer = PlaylistUserCollectionSerializer(data=request.data)
        if serializer.is_valid():
            playlist = serializer.validated_data["playlist"]
            playlist.collectors.add(request.user)
            playlist.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlaylistCollectionDeleteView(APIView):

    permission_classes = (IsAuthenticated, )

    def delete(self, request, pk, format=None):
        if len(Playlist.objects.filter(pk=pk)) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist = Playlist.objects.get(pk=pk)
        if request.user in playlist.collectors.all():
            playlist.collectors.remove(request.user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class FavoriteView(ListAPIView):
    serializer_class = MusicDetailSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    SearchFilter = ('title')
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        playlists = Playlist.objects.filter(owner=user).filter(name="我喜欢的歌曲")
        if len(playlists) != 0:
            return playlists.get().songs.all()
        else:
            return Music.objects.none()

    def post(self, request, format=None):
        serializer = FavoriteMusicSerializer(data=request.data)
        if serializer.is_valid():
            if len(Playlist.objects.filter(name="我喜欢的歌曲", owner=request.user)) == 0:
                playlist = Playlist()
                playlist.name = "我喜欢的歌曲"
                playlist.owner = request.user
                playlist.play_count = 0
                playlist.save()
            playlist = Playlist.objects.get(name="我喜欢的歌曲", owner=request.user)
            playlist.songs.add(serializer.validated_data["music"])
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FavoriteDetailView(RetrieveAPIView):
    serializer_class = MusicDetailSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    SearchFilter = ('title')
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        playlists = Playlist.objects.filter(owner=user).filter(name="我喜欢的歌曲")
        if len(playlists) != 0:
            return playlists.get().songs.all()
        else:
            return None

    def delete(self, request, pk, format=None):
        playlist = Playlist.objects.get(name="我喜欢的歌曲", owner=request.user)
        if len(playlist.songs.filter(pk=pk)) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist.songs.remove(Music.objects.get(pk=pk))
        return Response(status=status.HTTP_204_NO_CONTENT)
