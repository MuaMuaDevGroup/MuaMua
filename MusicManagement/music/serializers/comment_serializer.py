from rest_framework import serializers
from music.models import Comment
from django.db import models

class CommentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'user', 'level', 'text', 'add_time')


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('user', 'level', 'text')


class CommentUpdateSerializer(serializers.ModelSerializer):

    add_time = models.DateTimeField(auto_now=True)

    class Meta:
        model = Comment
        fields = ('level', 'text')
