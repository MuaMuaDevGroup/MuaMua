from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import MusicCreationSerializer, MusicDetailSerializer, MusicUpdateSerializer
from music.models import Music, Album, Artist


class MusicView(ListAPIView):
    queryset = Music.objects.all()
    serializer_class = MusicDetailSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    filter_fields = ('style', 'artist', 'album')
    pagination_class = LimitOffsetPagination
    search_fields = ('title',)
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        serializer = MusicCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class MusicDetailView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def get(self, request, pk, format=None):
        musics = Music.objects.filter(pk=pk)
        if len(musics) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        music = musics.get(pk=pk)
        serializer = MusicDetailSerializer(music)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        musics = Music.objects.filter(pk=pk)
        if len(musics) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        music = musics.get(pk=pk)
        serializer = MusicUpdateSerializer(music, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
