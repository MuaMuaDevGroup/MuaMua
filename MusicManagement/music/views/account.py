from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from captcha.models import CaptchaStore
from captcha.views import captcha_image
from music.serializers.account_serializer import AccountLoginSerializer, AccountChangePasswordSerializer, AccountDetailSerializer, AccountDetailUpdateSerializer, AccountRegistrationSerializer, AccountCaptchaGetSerializer
import base64
import datetime


class AccountLoginView(APIView):

    def post(self, request, format=None):
        serializer = AccountLoginSerializer(data=request.data)
        if serializer.is_valid():
            # Captcha
            hashkey = serializer.validated_data["validation_hash"]
            captcha = CaptchaStore.objects.filter(hashkey=hashkey).first()
            if (captcha == None) or (captcha and datetime.datetime.now() > captcha.expiration) or (captcha and captcha.response != serializer.validated_data["validation_code"].lower()):
                captcha.delete()
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            # Username And Password
            user = authenticate(
                username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            if user is not None:
                login(request=request, user=user)
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AccountRegistrationView(APIView):

    def post(self, request, format=None):
        serializer = AccountRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # Captcha
            hashkey = serializer.validated_data["validation_hash"]
            captcha = CaptchaStore.objects.filter(hashkey=hashkey).first()
            if (captcha == None) or (captcha and datetime.datetime.now() > captcha.expiration) or (captcha and captcha.response != serializer.validated_data["validation_code"].lower()):
                captcha.delete()
                return Response(status=status.HTTP_403_FORBIDDEN)
            # Create User
            if User.objects.filter(username=serializer.validated_data["username"]).first() != None:
                return Response(data={"message": "该用户已经存在"}, status=status.HTTP_409_CONFLICT)
            user = User.objects.create_user(
                serializer.validated_data["username"], serializer.validated_data["email"], serializer.validated_data["password"])
            if serializer.validated_data["last_name"] != None:
                user.last_name = serializer.validated_data["last_name"]
            if serializer.validated_data["first_name"] != None:
                user.first_name = serializer.validated_data["first_name"]
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AccountCaptchaView(APIView):

    def post(self, request, format=None):

        key = CaptchaStore.generate_key()
        image = base64.b64encode(captcha_image(request, key).content)
        serializer = AccountCaptchaGetSerializer(
            data={"key": key, "image": image.decode()})
        if serializer.is_valid():
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AccountLogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AccountChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        serializer = AccountChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            request.user.set_password(
                serializer.validated_data['new_password'])
            request.user.save()
            return Response(status=status.HTTP_201_CREATED)


class AccountDetailView(APIView):

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny(), ]
        else:
            self.permission_classes = [IsAuthenticated(), ]
        return self.permission_classes

    def get(self, request, format=None):
        serializer = AccountDetailSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, format=None):
        serializer = AccountDetailUpdateSerializer(
            request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = AccountRegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Check user exist
            users = User.objects.filter(
                username=serializer.validated_data["username"])
            if len(users) != 0:
                return Response(status=status.HTTP_409_CONFLICT)
            # Create User
            user = User.objects.create_user(
                serializer.validated_data["username"], serializer.validated_data["email"], serializer.validated_data["password"])
            if serializer.validated_data["last_name"] != None:
                user.last_name = serializer.validated_data["last_name"]
            if serializer.validated_data["first_name"] != None:
                user.first_name = serializer.validated_data["first_name"]
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
