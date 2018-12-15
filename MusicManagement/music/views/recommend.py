from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from music.serializers import RecommendListSerializer, RecommendCreateSerializer, RecommendUpdateSerializer
from music.models import Recommend



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



