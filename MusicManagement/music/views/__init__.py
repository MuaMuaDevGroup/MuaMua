from .account import AccountLoginView, AccountLogoutView, AccountChangePasswordView, AccountDetailView
from .music import MusicView, MusicDetailView, MusicDetailUploadView
from .artist import ArtistView, ArtistDetailView, ArtistPhotoUploadView
from .album import AlbumView, AlbumDetailView, AlbumCoverUploadView
from .user import UserDetailChangePasswordView, UserDetailView, UserView
from .playlist import PlaylistDetailView, PlaylistView, PlaylistDetailOwnershipView, PlaylistPhotoUploadView
from .comment import CommentListView, CommentDetailView, CommentUserView, CommentDetailUserView
from .recommend import RecommendView, RecommendUpdateView, RecommendUserView, RecommendMusicView, RecommendAlbumView, RecommendPlaylistView
