from rest_framework import serializers
from music.models import Recommend, Album
from django.db import models


class RecommendListSerializer(serializers.ModelSerializer):
    album = serializers.PrimaryKeyRelatedField(
        allow_null=True, queryset=Album.objects.all())
    class Meta:
        model = Recommend
        fields = ('id', 'playlist', 'playlist_title', 'description', 'date', 'cover')


class RecommendCreateSerializer(serializers.ModelSerializer):
    album = serializers.PrimaryKeyRelatedField(
        allow_null=True, queryset=Album.objects.all())
    class Meta:
        model = Recommend
        fields = ('playlist', 'playlist_title', 'description', 'date', 'cover')


class RecommendUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommend
        fields = ('description', 'cover')