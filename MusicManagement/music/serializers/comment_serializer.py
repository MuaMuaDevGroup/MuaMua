from rest_framework import serializers
from music.models import Comment


class CommentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'user', 'level', 'text')
