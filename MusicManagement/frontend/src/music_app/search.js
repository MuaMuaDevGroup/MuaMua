import 'angular'

angular.module('mm-app').controller("SearchController", ["$http", "$scope", "mmMusic", "mainPageComm", ($http, $scope, mmMusic, mmComm) => {

    $scope.sendToPlay = music => {
        mmMusic.setMusicPlaying(music);
    };
    $scope.selectedMusic = null;
    $scope.toSetSelectedMusic = (music) => $scope.selectedMusic = music;
    $scope.selectedPlaylistId = null;
    $scope.availablePlaylists = [];
    $scope.getPlaylists = () => {
        $http({
            url: "/api/playlist/my/",
            method: "GET"
        }).then(response => {
            $scope.availablePlaylists = response.data;
        })
    };
    $scope.addToPlaylist = (music, playlistid) => {
        $http({
            url: "/api/playlist/my/" + playlistid + "/",
            method: "GET"
        }).then(response => {
            let data = {
                name: response.data.name,
                description: response.data.description,
                songs: response.data.songs
            }
            data.songs.push(music.id);
            $http({
                url: "/api/playlist/my/" + playlistid + "/",
                method: "PUT",
                data: data
            })
        });
    }
    
    $scope.searchText = "";
    // Search Music Sections
    $scope.searchMusic = text => {
        $scope.musics = [];
        $http({
            url: "/api/music/?search=" + text,
            method: "GET"
        }).then(response => {
            $scope.musics = response.data;
            $scope.musics.forEach(e => {
                // Get Album Name
                if (e.album != null)
                    $http({
                        url: "/api/album/" + e.album + "/",
                        method: "GET"
                    }).then(response => e.albumTitle = response.data.title);
                // Get Artist Name
                e.artists = [];
                e.artist.forEach(a => {
                    $http({
                        url: "/api/artist/" + a + "/",
                        method: "GET"
                    }).then(response => e.artists.push(response.data.name));
                });
            });
        });
    };
    $scope.musics = [];

    // Search Album Sections
    $scope.searchAlbum = text => {
        $http({
            url: "/api/album/?search=" + text,
            method: "GET"
        }).then(response => {
            $scope.albums = response.data;
        });
    };
    $scope.albums = [];
    $scope.viewAlbum = album => {
        mmComm.playlistViewCtrlSetDisplay(album.id, "album");
        mmComm.musicCtrlSetDisplay('playlist_view');
    };


    // Search Playlist Sections
    $scope.searchPlaylist = text => {
        $http({
            url: "/api/playlist/?search=" + text,
            method: "GET"
        }).then(response => {
            $scope.playlists = response.data;
        });
    };
    $scope.viewPlaylist = playlist => {
        mmComm.playlistViewCtrlSetDisplay(playlist.id, "playlist");
        mmComm.musicCtrlSetDisplay('playlist_view');
    };
    $scope.playlists = [];
}]);