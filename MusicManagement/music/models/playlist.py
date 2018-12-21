from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User


class Playlist(models.Model):
    id = models.AutoField(primary_key=True)
    songs = models.ManyToManyField("Music")
    name = models.TextField()
    description = models.TextField(null=True)
    play_count = models.IntegerField(validators=[MinValueValidator(0)])
    collectors = models.ManyToManyField(User,related_name="playlist_collectors")
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    cover = models.ImageField(upload_to="playlist_cover", null=True)

    class Meta:
        unique_together=('name','owner',)
