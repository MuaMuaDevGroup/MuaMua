from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import RecommendListSerializer, RecommendCreateSerializer, RecommendUpdateSerializer
from music.models import Recommend
import random


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


class RecommendUserView(APIView):
    def get(self, request, format=None):
        recommend = Recommend.objects.all().order_by('date')[:1].get()
        serializer = RecommendListSerializer(recommend)
        return  Response(serializer.data, status=status.HTTP_200_OK)

