from django.db import models


class Music(models.Model):
    id = models.AutoField(primary_key=True)
    style = models.TextField(null=True)
    duration = models.IntegerField()
    title = models.TextField()
    album = models.ForeignKey(
        "Album",  related_name="tracks", on_delete=models.SET_NULL, null=True)
    artist = models.ManyToManyField("Artist")
    entity = models.FileField(upload_to="songs", null=True)

