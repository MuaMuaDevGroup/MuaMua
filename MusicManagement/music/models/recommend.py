from django.db import models


class Recommend(models.Model):
    id = models.AutoField(primary_key=True)
    playlist = models.ForeignKey(
        "Playlist",  related_name="recommend_playlist", on_delete=models.CASCADE)
    playlist_title = models.CharField(max_length=50, null=True)
    description = models.TextField(null=True)
    date = models.DateField(null=True)
    cover = models.ImageField(upload_to="recommend_playlist_cover", null=True)

