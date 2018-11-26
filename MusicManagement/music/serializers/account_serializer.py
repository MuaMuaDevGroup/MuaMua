from rest_framework import serializers

class AccountLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100)

class AccountChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(max_length=100)

class AccountDetailSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.CharField(max_length=254)
    last_login = serializers.DateTimeField()
    date_joined = serializers.DateTimeField()