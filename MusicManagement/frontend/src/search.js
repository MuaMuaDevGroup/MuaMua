import 'angular'

angular.module('mm-app').controller("SearchController", ["$http", "$scope", "mmMusic", "mainPageComm", ($http, $scope, mmMusic, mmComm) => {

    $scope.sendToPlay = music => {
        mmMusic.setMusicPlaying(music);
    };

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