from rest_framework import serializers
from music.models import Artist


class ArtistCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = ('name', 'country', 'birth')

class ArtistDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = ('id', 'name', 'country', 'birth')
        