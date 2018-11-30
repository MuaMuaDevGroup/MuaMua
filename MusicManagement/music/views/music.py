from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import MusicCreationSerializer, MusicDetailSerializer
from music.models import Music, Album, Artist


class MusicView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        serializer = MusicCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        serializer = MusicDetailSerializer(Music.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MusicDetailView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)
    
    def get(self, request, pk, format=None):
        serializer = MusicDetailSerializer(Music.objects.get(pk=pk))
        return Response(serializer.data, status=status.HTTP_200_OK)