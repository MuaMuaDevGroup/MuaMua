from rest_framework import serializers
from music.models import Recommend, Playlist
from django.db import models
from datetime import date


class RecommendListSerializer(serializers.ModelSerializer):
    playlist = serializers.PrimaryKeyRelatedField(
        allow_null=True, queryset=Playlist.objects.all())

    class Meta:
        model = Recommend
        fields = ('id', 'playlist', 'playlist_title',
                  'description', 'date', 'cover')


class RecommendCreateSerializer(serializers.ModelSerializer):
    playlist = serializers.PrimaryKeyRelatedField(
        allow_null=True, queryset=Playlist.objects.all())

    class Meta:
        model = Recommend
        fields = ('playlist', 'playlist_title', 'description')


class RecommendUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recommend
        fields = ('description',)
