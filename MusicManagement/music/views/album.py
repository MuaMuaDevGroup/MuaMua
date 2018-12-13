from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from music.serializers import AlbumCreationSerializer, AlbumDetailSerializer, AlbumUpdateSerializer, AlbumSerializer
from music.models import Album
import hashlib
import os

class AlbumView(ListAPIView):

    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    filter_fields = ('publisher',)
    pagination_class = LimitOffsetPagination
    search_fields = ('title',)
    permission_classes = (IsAuthenticated, IsAdminUser)

    def post(self, request, format=None):
        serializer = AlbumCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AlbumDetailView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def put(self, request, pk, format=None):
        albums = Album.objects.filter(pk=pk)
        if len(albums) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        album = albums.get(pk=pk)
        serializer = AlbumUpdateSerializer(album, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk, format=None):
        albums = Album.objects.filter(pk=pk)
        if len(albums) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        album = albums.get(pk=pk)
        serializer = AlbumDetailSerializer(album)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        albums = Album.objects.filter(pk=pk)
        if len(albums) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        album = albums.get(pk=pk)
        album.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AlbumCoverUploadView(APIView):

    parser_classes = (MultiPartParser,)
    permission_classes = (IsAuthenticated, IsAdminUser,)
    
    def post(self, request, pk, format=None):
        albums = Album.objects.filter(pk=pk)
        if len(albums) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        album = albums.get(pk=pk)
        file_object = request.FILES["file"]
        # Hash filename
        hasher = hashlib.md5()
        file_name, file_ext = os.path.splitext(file_object.name)
        hasher.update(str(pk).encode())
        file_name = hasher.hexdigest()
        file_object.name = "{0}{1}".format(file_name, file_ext)
        if album.cover != None:
            album.cover.delete()
        album.cover = file_object
        album.save()
        return Response(status=status.HTTP_201_CREATED)
    
