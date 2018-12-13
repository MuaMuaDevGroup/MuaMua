from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import ArtistCreationSerializer, ArtistDetailSerializer, ArtistUpdateSerializer
from music.models import Music, Album, Artist
import os
import hashlib


class ArtistView(ListAPIView):

    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    filter_fields = ('country',)
    pagination_class = LimitOffsetPagination
    search_fields = ('name',)
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        serializer = ArtistCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ArtistDetailView(APIView):

    permission_classes = (IsAuthenticated, IsAdminUser,)

    def get(self, request, pk, format=None):
        artists = Artist.objects.filter(pk=pk)
        if len(artists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        artist = artists.get(pk=pk)
        serializer = ArtistDetailSerializer(artist)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        artists = Artist.objects.filter(pk=pk)
        if len(artists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        artist = artists.get(pk=pk)
        serializer = ArtistUpdateSerializer(artist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ArtistPhotoUploadView(APIView):

    parser_classes = (MultiPartParser,)
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, pk, format=None):
        artists = Artist.objects.filter(pk=pk)
        if len(artists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        artist = artists.get(pk=pk)
        file_object = request.FILES["file"]
        # Hash filename
        hasher = hashlib.md5()
        file_name, file_ext = os.path.splitext(file_object.name)
        hasher.update(str(pk).encode())
        file_name = hasher.hexdigest()
        file_object.name = "{0}{1}".format(file_name, file_ext)
        if artist.photo != None:
            artist.photo.delete()
        artist.photo = file_object
        artist.save()
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, pk, format=None):
        artists = Artist.objects.filter(pk=pk)
        if len(artists) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        artist = artists.get(pk=pk)
        if artist.photo != None:
            artist.photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
