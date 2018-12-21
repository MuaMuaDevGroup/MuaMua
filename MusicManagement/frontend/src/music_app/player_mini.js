import 'angular'
import 'angular-audio'
import 'linqjs'

angular.module('mm-app').controller('MiniPlayerController', ["$http", "ngAudio", "mmMusic", "$scope", "mainPageComm", ($http, ngAudio, mmMusic, $scope, comm) => {

    $scope.setDisplay = (displayName) => comm.musicCtrlSetDisplay(displayName);
    $scope.loadedAudio = [];
    $scope.music = mmMusic.getMusicPlaying();
    $scope.audio = {};
    if ($scope.music != null) {
        $scope.audio = ngAudio.load($scope.music.entity);
        $scope.loadMusicDetail($scope.music);
    }

    $scope.canChange = false;

    Object.defineProperty($scope, "currentTime", {
        get: function () {
            if ($scope.audio != null)
                return $scope.audio.currentTime;
        },
        set: function (value) {
            if ($scope.audio != null && $scope.canChange == true)
                $scope.audio.currentTime = value;
        }
    });

    Object.defineProperty($scope, "volume", {
        get: function () {
            if ($scope.audio != null)
                return $scope.audio.volume * 100;
        },
        set: function (value) {
            if ($scope.audio != null)
                $scope.audio.volume = value / 100;
        }
    });

    $scope.togglePlay = () => {
        if ($scope.audio != null && $scope.audio.paused) {
            $scope.audio.play();
        }
        else
            $scope.audio.pause();
    };


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
        // Release previous audio
        if ($scope.music != null) {
            // Save loaded Audio
            if ($scope.loadedAudio.first(a => a.id == $scope.music.id) == null)
                $scope.loadedAudio.push({
                    id: $scope.music.id,
                    audio: $scope.audio
                });
            $scope.audio.stop();
            $scope.audio = null;
        }
        $scope.music = music;
        $scope.loadMusicDetail($scope.music);
        // Try to load from cache
        let d = $scope.loadedAudio.first(a => a.id == music.id);
        if (d == null)
            $scope.audio = ngAudio.load($scope.music.entity);
        else
            $scope.audio = d.audio;
        $scope.audio.volume = 1;
    };

    mmMusic.registerOnMusicChanged($scope.onMusicChanged);

}]);
