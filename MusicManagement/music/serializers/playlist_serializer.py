from rest_framework import serializers
from music.models import Music, Album, Artist, Playlist
from django.contrib.auth.models import User


class PlaylistCreationSerializer(serializers.ModelSerializer):

    songs = serializers.PrimaryKeyRelatedField(
        allow_null=True, many=True, queryset=Music.objects.all())

    class Meta:
        model = Playlist
        fields = ('name', 'description', 'songs')

    def create(self, validated_data):
        playlist = Playlist()
        playlist.name = validated_data.get("name")
        playlist.description = validated_data.get("description")
        playlist.play_count = 0
        playlist.save()
        playlist.songs.set(validated_data.get("songs"))

        return playlist


class PlaylistUpdateSerializer(serializers.ModelSerializer):

    songs = serializers.PrimaryKeyRelatedField(
        queryset=Music.objects.all(), many=True)

    class Meta:
        model = Playlist
        fields = ('name', 'description', 'songs', 'play_count')


class PlaylistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Playlist
        fields = ('id', 'name', 'play_count', 'cover')


class PlaylistDetailSerializer(serializers.ModelSerializer):

    songs = serializers.SlugRelatedField(
        slug_field="id", many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ('id', 'name', 'description',
                  'play_count', 'songs', 'owner', 'cover')


class PlaylistOwnersAddSerializer(serializers.ModelSerializer):

    collectors = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = Playlist
        fields = ('collectors',)

    def update(self, instance, validated_data):
        for collector in User.objects.filter(pk__in=validated_data.get("collectors")):
            instance.collectors.add(collector)
        instance.save()
        return instance


class PlayListOwnersDetailSerializer(serializers.ModelSerializer):

    collectors = serializers.SlugRelatedField(
        slug_field="id", many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ('collectors',)


class PlayListOwnersDeleteSerializer(serializers.ModelSerializer):

    collectors = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = Playlist
        fields = ('collectors',)

    def update(self, instance, validated_data):
        for collector in User.objects.filter(pk__in=validated_data.get("collectors")):
            instance.collectors.remove(collector)
        instance.save()
        return instance
