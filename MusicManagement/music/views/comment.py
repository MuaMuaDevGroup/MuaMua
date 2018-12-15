from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from music.serializers import CommentListSerializer,CommentCreateSerializer, CommentUpdateSerializer
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
        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return  Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)



class CommentDetailView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser,)
    def put(self, request, pk ,format=None):
        '''
        修改评论 ，只允许修改level和text 不允许修改用户和id
        '''
        comments = Comment.objects.filter(pk=pk)
        if len(comments) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment = comments.get(pk=pk)
        serializer = CommentUpdateSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        comment = Comment.objects.filter(pk=pk)
        if len(comment) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)






