from rest_framework import serializers
from django.contrib.auth.models import User


class UserCreationSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField(allow_null=True)
    last_name = serializers.CharField(allow_null=True)
    is_admin = serializers.BooleanField()


class UserUpdateSerializer(serializers.Serializer):

    email = serializers.EmailField()
    first_name = serializers.CharField(allow_null=True)
    last_name = serializers.CharField(allow_null=True)
    is_admin = serializers.BooleanField()


class UserPasswordChangeSerializer(serializers.Serializer):

    new_password = serializers.CharField()


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  "is_staff", 'last_login', 'date_joined')


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email')
