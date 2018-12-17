import 'angular'
import 'angular-audio'

angular.module('mm-app').controller('MiniPlayerController', ["$http", "ngAudio", "mmMusic", "$scope", ($http, ngAudio, mmMusic, $scope) => {

    $scope.music = mmMusic.getMusicPlaying();
    $scope.audio = {};
    if ($scope.music != null) {
        $scope.audio = ngAudio.load($scope.music.entity);
        $scope.loadMusicDetail($scope.music);
    }

    $scope.togglePlay = () => {
        if ($scope.audio != null && $scope.audio.paused) {
            console.log($scope.audio.progress);
            $scope.audio.play();
        }
        else
            $scope.audio.pause();
    };
    Object.defineProperty($scope, "percentage", {
        get: function () {
            if ($scope.audio != null && $scope.audio.progress != null)
            {
                return parseFloat($scope.audio.progress.toPrecision());
            }
            else
                return 0.5;
        },
        set: function (value) {
            if ($scope.audio != null && $scope.audio.progress != null)
                $scope.audio.progress = value;
        }
    });

    // Load Music Cover from its Album
    $scope.loadMusicDetail = (music) => {
        $http({
            url: "/api/music/" + music.id + "/",
            method: "GET"
        }).then(response => {
            if (response.data.album != null) {
                // Load Album
                let albumId = response.data.album;
                $http({
                    url: "/api/album/" + albumId + "/",
                    method: "GET"
                }).then(response => {
                    music.cover = response.data.cover;
                });
                // Load Artist
                music.artistsName = []
                response.data.artist.forEach(a => {
                    $http({
                        url: "/api/artist/" + a + "/",
                        method: "GET"
                    }).then(response => {
                        music.artistsName.push(response.data.name);
                    });
                });
            }
        });
    };

    $scope.onMusicChanged = (music) => {
        $scope.music = music;
        $scope.loadMusicDetail($scope.music);
        $scope.audio = ngAudio.load($scope.music.entity);
    };

    mmMusic.registerOnMusicChanged($scope.onMusicChanged);

}]);
