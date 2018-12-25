import 'angular'
import 'angular-audio'

angular.module('mm-app').controller("RecommendController", ["$http", "$scope", "mmMusic", ($http, $scope, mmMusic) => {
    $scope.refreshMusic = () => {
        $http({
            method: "GET",
            url: "/api/music"
        }).then((response) => {
            $scope.musics = response.data;
        });
    };
    $scope.sendToPlay = (music) => {
        mmMusic.setMusicPlaying(music);
    };
}]);