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


class AlbumSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'year', 'publisher')


class AlbumDetailSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    title = serializers.CharField()
    year = serializers.DateField()
    publisher = serializers.CharField()
    description = serializers.CharField()
    tracks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'year', 'publisher', 'tracks')
