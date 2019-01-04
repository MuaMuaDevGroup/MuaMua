import 'angular'

angular.module('mm-app').controller("RecommendDetailController", ["$http", "$scope", "mmMusic", "mainPageComm", ($http, $scope, mmMusic, mmComm) => {
    mmComm.setRecommendDetailLoadHandler((recommend) => {
        $scope.recommend = recommend;
        loadPlaylist();
    });

    $scope.sendToPlay = music => {
        mmMusic.setMusicPlaying(music);
    };

    let loadPlaylist = () => {
        //Load Playlist
        let playlistRtn = {};
        $http({
            url: "/api/playlist/" + $scope.recommend.playlist + "/",
            method: "GET"
        }).then(response => {
            $scope.recommend.playlistDetail = response.data;
            $scope.recommend.playlistDetail.songEntities = [];
            response.data.songs.forEach(s => {
                loadMusic(s);  
            });
        });
    };

    let loadMusic = (musicId) => {
        $http({
            url: "/api/music/" + musicId + "/",
            method: "GET"
        }).then(response => {
            let song = response.data;
            $scope.recommend.playlistDetail.songEntities.push(song);
        })
    };

    $scope.recommend = null;

}]);