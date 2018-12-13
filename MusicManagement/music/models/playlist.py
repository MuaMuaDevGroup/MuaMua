from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User


class Playlist(models.Model):
    id = models.AutoField(primary_key=True)
    songs = models.ManyToManyField("Music")
    name = models.TextField()
    description = models.TextField(null=True)
    play_count = models.IntegerField(validators=[MinValueValidator(0)])
    owners = models.ManyToManyField(User, null=True)
    cover = models.ImageField(upload_to="playlist_cover", null=True)
    
