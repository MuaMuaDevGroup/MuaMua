from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import ArtistCreationSerializer, ArtistDetailSerializer
from music.models import Music, Album, Artist


class ArtistView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        serializer = ArtistCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        serializer = ArtistDetailSerializer(Artist.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
