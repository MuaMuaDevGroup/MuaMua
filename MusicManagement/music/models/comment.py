from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    text = models.TextField(null=True)
    add_time = models.DateTimeField(auto_now=True)
    music = models.ForeignKey('Music', related_name="music_commment", on_delete=models.CASCADE)
