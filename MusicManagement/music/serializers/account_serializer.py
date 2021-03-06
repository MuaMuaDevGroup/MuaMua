from rest_framework import serializers
from django.contrib.auth.models import User


class AccountCaptchaGetSerializer(serializers.Serializer):
    key = serializers.CharField()
    image = serializers.CharField()


class AccountRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.CharField(max_length=254)
    first_name = serializers.CharField(max_length=254, allow_null=True)
    last_name = serializers.CharField(max_length=254, allow_null=True)
    password = serializers.CharField(max_length=100)
    validation_code = serializers.CharField()
    validation_hash = serializers.CharField()

class AccountLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100)
    validation_code = serializers.CharField()
    validation_hash = serializers.CharField()

class AccountChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(max_length=100)


class AccountDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField(max_length=150)
    email = serializers.CharField(max_length=254)
    first_name = serializers.CharField(max_length=254)
    last_name = serializers.CharField(max_length=254)
    last_login = serializers.DateTimeField()
    date_joined = serializers.DateTimeField()


class AccountDetailUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')


