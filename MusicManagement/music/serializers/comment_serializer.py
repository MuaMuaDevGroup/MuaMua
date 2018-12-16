from rest_framework import serializers
from music.models import Comment, Music
from django.db import models

class CommentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'user', 'level', 'text', 'add_time', 'music')


class CommentCreateSerializer(serializers.ModelSerializer):
    music = serializers.PrimaryKeyRelatedField(
        allow_null=True, queryset=Music.objects.all())
    class Meta:
        model = Comment
        fields = ('user', 'level', 'text', 'music')


class CommentUpdateSerializer(serializers.ModelSerializer):

    add_time = models.DateTimeField(auto_now=True)

    class Meta:
        model = Comment
        fields = ('level', 'text')

class CommentUserCreateSerializer(serializers.Serializer):

    level = serializers.IntegerField(max_value=5, min_value=1)
    text = serializers.CharField()
    music = serializers.IntegerField()

