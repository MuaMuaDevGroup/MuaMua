from django.db import models


class Album(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.TextField()
    description = models.TextField(null=True)
    year = models.DateField(null=True)
    publisher = models.TextField(null=True)
    cover = models.ImageField(upload_to="album_cover", null=True)
