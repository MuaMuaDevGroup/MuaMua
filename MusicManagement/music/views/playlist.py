from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import PlaylistCreationSerializer, PlaylistDetailSerializer, PlaylistOwnersAddSerializer, PlayListOwnersDeleteSerializer, PlayListOwnersDetailSerializer, PlaylistSerializer, PlaylistUpdateSerializer
from music.models import Music, Album, Artist, Playlist


class PlaylistView(ListAPIView):

    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    search_fields = ('name',)
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        serializer = PlaylistCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlaylistDetailView(APIView):

    def get(self, request, pk, format=None):
        serializer = PlaylistDetailSerializer(Playlist.objects.get(pk=pk))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        playlist = Playlist.objects.get(pk=pk)
        serializer = PlaylistUpdateSerializer(playlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        playlist = Playlist.objects.get(pk=pk)
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaylistDetailOwnershipView(APIView):

    def get(self, request, pk, format=None):
        serializer = PlayListOwnersDetailSerializer(
            Playlist.objects.get(pk=pk))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk, format=None):
        serializer = PlaylistOwnersAddSerializer(
            Playlist.objects.get(pk=pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        serializer = PlayListOwnersDeleteSerializer(
            Playlist.objects.get(pk=pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
