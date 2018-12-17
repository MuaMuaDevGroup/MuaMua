import 'angular'
import 'angular-audio'

angular.module('mm-app').controller('MiniPlayerController', ["$http", "ngAudio", "mmMusic", "$scope", ($http, ngAudio, mmMusic, $scope) => {

    $scope.music = mmMusic.getMusicPlaying();
    $scope.audio = {};
    if ($scope.music != null) {
        $scope.audio = ngAudio.load($scope.music.entity);
        $scope.music.cover = this.loadMusicAlbum($scope.music);
    }

    $scope.togglePlay = () => {
        if ($scope.audio != null && $scope.audio.paused)
            $scope.audio.play();
        else
            $scope.audio.pause();
    };

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

    $scope.onMusicChanged = (music) => {
        $scope.music = music;
        $scope.music.cover = $scope.loadMusicAlbum($scope.music);
        $scope.audio = ngAudio.load($scope.music.entity);
    };

    mmMusic.registerOnMusicChanged($scope.onMusicChanged);

}]);
