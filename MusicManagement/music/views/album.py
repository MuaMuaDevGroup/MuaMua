from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import AlbumCreationSerializer, AlbumDetailSerializer, AlbumUpdateSerializer, AlbumSerializer
from music.models import Album


class AlbumView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        serializer = AlbumCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        serializer = AlbumSerializer(Album.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AlbumDetailView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def put(self, request, pk, format=None):
        album = Album.objects.get(pk=pk)
        serializer = AlbumUpdateSerializer(album, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk, format=None):
        serializer = AlbumDetailSerializer(Album.objects.get(pk=pk))
        return Response(serializer.data, status=status.HTTP_200_OK)
