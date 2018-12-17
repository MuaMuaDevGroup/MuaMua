import 'angular'
import 'angular-audio'

angular.module('mm-app').controller('MiniPlayerController', ["$http", "ngAudio", "mmMusic", "$scope", ($http, ngAudio, mmMusic, $scope) => {

    $scope.music = mmMusic.getMusicPlaying();
    $scope.playing = null;
    if ($scope.music != null) {
        $scope.playing = ngAudio.load($scope.music.entity);
        $scope.music.cover = this.loadMusicAlbum($scope.music);
    }


    mmMusic.registerOnMusicChanged(music => {
        $scope.playing = ngAudio.load(music.entity);
        $scope.music.cover = $scope.loadMusicAlbum($scope.music);
    });

    // Load Music Cover from its Album
    $scope.loadMusicAlbum = (music) => {
        $http({
            url: "/api/music/" + music.id + "/",
            method: "GET"
        }).then(response => {
            if (response.data.album != null) {
                let albumId = response.data.album;
                $http({
                    url: "/api/album/" + albumId + "/",
                    method: "GET"
                }).then(response => {
                    return response.data.cover;
                });
            }
        });
    };

}]);
