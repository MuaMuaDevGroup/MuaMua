from rest_framework import serializers
from music.models import Music, Album, Artist


class MusicCreationSerializer(serializers.ModelSerializer):
    album = serializers.PrimaryKeyRelatedField(
        allow_null=True, queryset=Album.objects.all())
    artist = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Artist.objects.all())

    class Meta:
        model = Music
        fields = ('style', 'duration', 'title', 'album', 'artist')


class MusicDetailSerializer(serializers.ModelSerializer):
    album = serializers.SlugRelatedField(slug_field="title", read_only=True)
    artist = serializers.SlugRelatedField(
        slug_field="name", many=True, read_only=True)

    class Meta:
        model = Music
        fields = ('id', 'style', 'duration', 'title', 'album', 'artist')
