from rest_framework import serializers
from music.models import Album


class AlbumCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = ('title', 'description', 'year', 'publisher')


class AlbumUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = ('title', 'description', 'year', 'publisher')


class AlbumDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'year', 'publisher')
