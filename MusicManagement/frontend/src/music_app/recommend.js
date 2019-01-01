import 'angular'
import 'angular-audio'
import 'linqjs'

angular.module('mm-app').controller("RecommendController", ["$http", "$scope", "mmMusic", "mainPageComm", ($http, $scope, mmMusic, mmComm) => {

    $scope.sendToPlay = music => {
        mmMusic.setMusicPlaying(music);
    };
    $scope.viewAlbum = album => {
        mmComm.playlistViewCtrlSetDisplay(album.id, "album");
        mmComm.musicCtrlSetDisplay('playlist_view');
    };
    $scope.viewPlaylist = playlist => {
        mmComm.playlistViewCtrlSetDisplay(playlist.id, "playlist");
        mmComm.musicCtrlSetDisplay('playlist_view');
    };

    $scope.recommends = [];
    $scope.musics = [];
    $scope.albums = [];
    $scope.playlists = [];
    $scope.loadArtist = (artistIds, nowArtistNames) => {
        let rtnArtistNames = [];
        artistIds.forEach(t => {
            if (!nowArtistNames.first(l => l.id == t)) {
                $http({
                    url: "/api/artist/" + t + "/",
                    method: "GET"
                }).then(response => {
                    let a = response.data.name;
                    nowArtistNames.push(a);
                    rtnArtistNames.push(a);
                });
            }
        });
        return rtnArtistNames;
    };

    $scope.refreshRecommend = () => {
        // Recommends
        $http({
            url: "/api/recommend/?limit=3",
            method: "GET"
        }).then(response => $scope.recommends = response.data.results);
        // Musics
        $http({
            url: "/api/recommend/music/?count=7",
            method: "GET"
        }).then(response => {
            $scope.musics = response.data;
            let nowArtistNames = [];
            $scope.musics.forEach(m => {
                let n = $scope.loadArtist(m.artist, nowArtistNames);
                m.artistNames = n;
            });
        });
        // Albums
        $http({
            url: "/api/recommend/album/?count=4",
            method: "GET"
        }).then(response => $scope.albums = response.data);
        // Playlist
        $http({
            url: "/api/recommend/playlist/?count=4",
            method: "GET"
        }).then(response => { $scope.playlists = response.data });
    };

    $scope.refreshRecommend();
}]);