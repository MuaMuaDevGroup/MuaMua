import 'angular'
import 'angular-audio'
angular.module('mm-app').filter("musicTime", () => {
    return (input) => {
        if ((typeof input) != "number")
            return "00:00";
        let padding = (data) => {
            let t = data.toString();
            if (t.length != 2)
                t = "0" + t;
            return t;
        };
        let hour = input / 3600;
        hour = parseInt(hour);
        let minute = (input - hour * 60) / 60;
        minute = parseInt(minute);
        let second = (input - minute * 60 - hour * 3600);
        second = parseInt(second);
        let format = "";
        if (hour != 0)
            format += padding(hour) + ":";
        format += padding(minute) + ":" + padding(second);
        return format;
    };
});

angular.module('mm-app').controller('MiniPlayerController', ["$http", "ngAudio", "mmMusic", "$scope", ($http, ngAudio, mmMusic, $scope) => {

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

    $scope.togglePlay = () => {
        if ($scope.audio != null && $scope.audio.paused) {
            console.log($scope.audio.progress);
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
        $scope.music = music;
        $scope.loadMusicDetail($scope.music);
        $scope.audio = ngAudio.load($scope.music.entity);
    };

    mmMusic.registerOnMusicChanged($scope.onMusicChanged);

}]);
