from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from music.serializers import UserCreationSerializer, UserDetailSerializer, UserPasswordChangeSerializer, UserUpdateSerializer, UserSerializer


class UserView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    filter_fields = ()
    pagination_class = LimitOffsetPagination
    search_fields = ('username', 'email')
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def post(self, request, format=None):
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                serializer.validated_data["username"], serializer.validated_data["email"], serializer.validated_data["password"])
            if serializer.validated_data["last_name"] != None:
                user.last_name = serializer.validated_data["last_name"]
            if serializer.validated_data["first_name"] != None:
                user.first_name = serializer.validated_data["first_name"]
            user.is_staff = serializer.validated_data["is_admin"]
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)



class UserDetailView(APIView):

    permission_classes = (IsAuthenticated, IsAdminUser,)

    def put(self, request, pk, format=None):
        serializer = UserUpdateSerializer(data=request.data)
        if serializer.is_valid():
            users = User.objects.filter(pk=pk)
            if len(users) == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)
            user = users.get(pk=pk)
            user.email = serializer.validated_data["email"]
            user.is_staff = serializer.validated_data["is_admin"]
            user.is_active = serializer.validated_data["is_active"]
            if serializer.validated_data["first_name"] != None:
                user.first_name = serializer.validated_data["first_name"]
            if serializer.validated_data["last_name"] != None:
                user.last_name = serializer.validated_data["last_name"]
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk, format=None):
        users = User.objects.filter(pk=pk)
        if len(users) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = users.get(pk=pk)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDetailChangePasswordView(APIView):

    permission_classes = (IsAuthenticated, IsAdminUser,)

    def put(self, request, pk, format=None):
        serializer = UserPasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            users = User.objects.filter(pk=pk)
            if len(users) == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)
            user = users.get(pk=pk)
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
