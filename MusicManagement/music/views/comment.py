from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from music.serializers import CommentListSerializer, CommentCreateSerializer, CommentUpdateSerializer, CommentUserCreateSerializer
from music.models import Comment, Music
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly


class CommentListView(ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentListSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    search_fields = ('text',)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def post(self, request, format=None):
        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CommentDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    def get(self, request, pk, format=None):
        comments = Comment.objects.filter(pk=pk)
        if len(comments) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment = comments.get(pk=pk)
        serializer = CommentListSerializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        '''
        修改评论 ，只允许修改level和text 不允许修改用户和id
        '''
        comments = Comment.objects.filter(pk=pk)
        if len(comments) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment = comments.get(pk=pk)
        if comment.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = CommentUpdateSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        comments = Comment.objects.filter(pk=pk)
        if len(comments) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment = comments.get(pk=pk)
        if comment.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentUserView(ListAPIView):
    serializer_class = CommentListSerializer
    filter_backends = (SearchFilter,)
    pagination_class = LimitOffsetPagination
    search_fields = ('text',)
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(user=user)

    def post(self, request, format=None):
        serializer = CommentUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            music_id = serializer.validated_data["music"]
            if len(Music.objects.filter(pk=music_id)) == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)
            comment = Comment()
            comment.user = request.user
            comment.level = serializer.validated_data["level"]
            comment.text = serializer.validated_data["text"]
            comment.music = Music.objects.get(pk=music_id)
            comment.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CommentDetailUserView(RetrieveAPIView):

    serializer_class = CommentListSerializer
    permission_classes = (IsAuthenticated, )
    filter_backends = ()

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(user=user)

    def put(self, request, pk, format=None):
        # Check Exist
        if len(Comment.objects.filter(pk=pk)) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment = Comment.objects.get(pk=pk)
        # Check User belongs
        if comment.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        # Action
        serializer = CommentUpdateSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        # Check Exist
        if len(Comment.objects.filter(pk=pk)) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment = Comment.objects.get(pk=pk)
        # Check User belongs
        if comment.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        # Delete
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
