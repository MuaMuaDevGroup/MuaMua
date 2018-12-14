from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from music.serializers import CommentListSerializer
from music.models import Comment
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser



class CommentListView(ListAPIView):
    queryset  = Comment.objects.all()
    serializer_class = CommentListSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    search_fields = ('text',)
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        pass








