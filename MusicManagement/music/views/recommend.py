from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import RecommendListSerializer, RecommendCreateSerializer, RecommendUpdateSerializer, MusicDetailSerializer, AlbumSerializer, PlaylistSerializer
from music.models import Recommend, Music, Album, Playlist
import random
import os
import hashlib


class RecommendView(ListAPIView):
    queryset = Recommend.objects.all()
    serializer_class = RecommendListSerializer
    pagination_class = LimitOffsetPagination
    permission_classes = (IsAuthenticated, IsAdminUser,)
    search_fields = ('description',)
    filter_backends = (SearchFilter,)

    def post(self, request, format=None):
        serializer = RecommendCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RecommendUpdateView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def put(self, request, pk, format=None):
        recommends = Recommend.objects.filter(pk=pk)
        if len(recommends) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        recommend = recommends.get(pk=pk)
        serializer = RecommendUpdateSerializer(recommend, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        recommend = Recommend.objects.filter(pk=pk)
        if len(recommend) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        recommend.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RecommendUploadCoverView(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, pk, format=None):
        recommend = Recommend.objects.filter(pk=pk).first()
        if recommend == None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        file_object = request.FILES["file"]
        # Hash filename
        hasher = hashlib.md5()
        file_name, file_ext = os.path.splitext(file_object.name)
        hasher.update(str(pk).encode())
        file_name = hasher.hexdigest()
        file_object.name = "{0}{1}".format(file_name, file_ext)
        if recommend.cover != None:
            recommend.cover.delete()
        recommend.cover = file_object
        recommend.save()
        return Response(status=status.HTTP_201_CREATED)


class RecommendUserView(APIView):

    def get(self, request, format=None):
        recommend = Recommend.objects.all().order_by('date')[:1].get()
        serializer = RecommendListSerializer(recommend)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecommendMusicView(APIView):

    def get(self, request, format=None):
        count = 10
        if request.query_params.__contains__("count"):
            count = int(request.query_params.__getitem__("count"))
        musics_id = Music.objects.values_list('id', flat=True)
        if len(musics_id) < count:
            recommends_id = list(musics_id)
        else:
            recommends_id = random.sample(list(musics_id), count)
        recommends = Music.objects.filter(pk__in=recommends_id)
        serailizer = MusicDetailSerializer(recommends, many=True)
        return Response(serailizer.data, status=status.HTTP_200_OK)


class RecommendAlbumView(APIView):

    def get(self, request, format=None):
        count = 10
        if request.query_params.__contains__("count"):
            count = int(request.query_params.__getitem__("count"))
        albums_id = Album.objects.values_list('id', flat=True)
        if len(albums_id) < count:
            recommends_id = list(albums_id)
        else:
            recommends_id = random.sample(list(albums_id), count)
        recommends = Album.objects.filter(pk__in=recommends_id)
        serailizer = AlbumSerializer(recommends, many=True)
        return Response(serailizer.data, status=status.HTTP_200_OK)


class RecommendPlaylistView(APIView):

    def get(self, request, format=None):
        count = 10
        if request.query_params.__contains__("count"):
            count = int(request.query_params.__getitem__("count"))
        playlists_id = Playlist.objects.values_list('id', flat=True)
        if len(playlists_id) < count:
            recommends_id = list(playlists_id)
        else:
            recommends_id = random.sample(list(playlists_id), count)
        recommends = Playlist.objects.filter(pk__in=recommends_id)
        serailizer = PlaylistSerializer(recommends, many=True)
        return Response(serailizer.data, status=status.HTTP_200_OK)
