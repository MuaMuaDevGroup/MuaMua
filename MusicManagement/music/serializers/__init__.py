from .account_serializer import AccountChangePasswordSerializer, AccountDetailSerializer, AccountLoginSerializer, AccountRegisterSerializer
from .music_serializer import MusicCreationSerializer, MusicDetailSerializer, MusicUpdateSerializer, FavoriteMusicSerializer
from .artist_serializer import ArtistCreationSerializer, ArtistDetailSerializer, ArtistUpdateSerializer
from .album_serializer import AlbumCreationSerializer, AlbumDetailSerializer, AlbumUpdateSerializer, AlbumSerializer
from .user_serializer import UserCreationSerializer, UserDetailSerializer, UserPasswordChangeSerializer, UserUpdateSerializer, UserSerializer
from .playlist_serializer import PlaylistCreationSerializer, PlaylistDetailSerializer, PlaylistOwnersAddSerializer, PlayListOwnersDeleteSerializer, PlayListOwnersDetailSerializer, PlaylistSerializer, PlaylistUpdateSerializer, PlaylistUserCreationSerializer, PlaylistUserUpdateSerializer, PlaylistUserCollectionSerializer
from .comment_serializer import CommentListSerializer, CommentCreateSerializer, CommentUpdateSerializer, CommentUserCreateSerializer
from .recommend_serializer import RecommendListSerializer, RecommendCreateSerializer, RecommendUpdateSerializer
