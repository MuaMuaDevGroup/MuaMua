from rest_framework import serializers
from music.models import Album, Music


class AlbumCreationSerializer(serializers.ModelSerializer):

    tracks = serializers.ListField(
        child=serializers.IntegerField(), allow_null=True)

    class Meta:
        model = Album
        fields = ('title', 'description', 'year', 'publisher', 'tracks')

    def create(self, validated_date):
        tracks_data = validated_date.get("tracks")
        a = Album()
        a.title = validated_date.pop("title")
        a.year = validated_date.pop("year")
        a.publisher = validated_date.pop("publisher")
        a.description = validated_date.pop("description")
        a.save()
        if tracks_data != None:
            for track_id in tracks_data:
                m = Music.objects.get(pk=track_id)
                m.album = a
                m.save()
        return a


class AlbumUpdateSerializer(serializers.ModelSerializer):

    tracks = serializers.ListField(
        child=serializers.IntegerField(), allow_null=True)

    class Meta:
        model = Album
        fields = ('title', 'description', 'year', 'publisher', 'tracks')

    def update(self, instance, validated_date):
        tracks_data = validated_date.get("tracks")
        for music in Music.objects.filter(album=instance):
            music.album = None
            music.save()
        if tracks_data != None:
            for track_id in tracks_data:
                m = Music.objects.get(pk=track_id)
                m.album = instance
                m.save()
        instance.title = validated_date.get("title")
        instance.year = validated_date.get("year")
        instance.publisher = validated_date.get("publisher")
        instance.description = validated_date.get("description")
        instance.save()
        return instance


class AlbumSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'year', 'publisher', 'cover')


class AlbumDetailSerializer(serializers.ModelSerializer):

    tracks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Album
        fields = ('id', 'title', 'description', 'year',
                  'publisher', 'tracks', 'cover')
