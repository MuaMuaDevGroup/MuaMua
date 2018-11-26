from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    text = models.TextField(null=True)
