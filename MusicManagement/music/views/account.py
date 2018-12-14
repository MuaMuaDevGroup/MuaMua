from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from music.serializers.account_serializer import AccountLoginSerializer, AccountChangePasswordSerializer, AccountDetailSerializer, AccountDetailUpdateSerializer


class AccountLoginView(APIView):

    def post(self, request, format=None):
        serializer = AccountLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            if user is not None:
                login(request=request, user=user)
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)


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
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        serializer = AccountDetailSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

<<<<<<< Updated upstream
    def put(self, request, format=None):
        serializer = AccountDetailUpdateSerializer(request.user, data=request.data)
=======
    def put(self, request,  format=None):
        user = request.user
        serializer = AccountDetailUpdateSerializer(user, data=request.data)
>>>>>>> Stashed changes
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

