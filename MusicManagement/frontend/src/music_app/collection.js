import 'angular'

angular.module('mm-app').controller("CollectionController", ["$http", "$scope", "mainPageComm", ($http, $scope, comm) => {


    comm.setRefreshCollectionPageHandler(() => {
        $scope.refreshCollection();
    });

    $scope.collectionPlaylist = [];
    $scope.refreshCollection = () => {
        $http({
            url: "/api/playlist/my/collection/",
            method: "GET"
        }).then(response => { 
            $scope.collectionPlaylist = response.data;
        });
    };


    $scope.viewPlaylist = playlist => {
        comm.playlistViewCtrlSetDisplay(playlist.id, "playlist");
        comm.musicCtrlSetDisplay('playlist_view');
    };
}]);