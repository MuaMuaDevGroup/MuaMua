from django.db import models

class Artist(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(unique=False)
    country = models.TextField()
    birth = models.DateField(null=True)
    photo = models.ImageField(upload_to="artist_photo", null=True)
    