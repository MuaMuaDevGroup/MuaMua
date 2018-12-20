from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser,IsAuthenticatedOrReadOnly
from music.serializers import PlaylistCreationSerializer, PlaylistDetailSerializer, PlaylistOwnersAddSerializer, PlayListOwnersDeleteSerializer, PlayListOwnersDetailSerializer, PlaylistSerializer, PlaylistUpdateSerializer
from music.models import Music, Album, Artist, Playlist
from music.permissions import IsAdminOrReadOnly
import os,hashlib

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
    queryset = Playlist.objects.all()
    serializer_class=PlaylistSerializer
    filter_backends=(SearchFilter,)
    pagination_class = LimitOffsetPagination
    SearchFilter=('name')
    permission_classes=(IsAuthenticatedOrReadOnly,)

    def post(self,request,format=None):
        serializer=PlaylistCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PlaylistDetailUserView(APIView):
    permission_classes=(IsAuthenticatedOrReadOnly,)
    def get(self,request,pk,format=None):
        playlists=Playlist.objects.filter(pk=pk)
        if len(playlists)==0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist=playlists.get(pk=pk)
        serializer=PlaylistSerializer(playlist)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self,request,pk,format=None):
        playlists=Playlist.objects.filter(pk=pk)
        if len(comments)==0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist=playlists.get(pk=pk)
        if playlist.owner!=request.owner:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer=PlaylistUpdateSerializer(playlist,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,pk,format=None):
        playlists=Playlist.objects.filter(pk=pk)
        if len(comments)==0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        playlist=playlists.get(pk=pk)
        if playlist.owner!=request.owner:
            return Response(status=status.HTTP_403_FORBIDDEN)
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PlaylistCollectionView(APIView):
    pass


class PlaylistCollectionDeleteView(APIView):
    pass

class FavoriteView(APIView):
    pass

class FavoriteDetailView(APIView):
    pass