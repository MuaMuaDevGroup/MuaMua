import 'angular'
import 'angular-audio'

angular.module('mm-app').controller("MusicController", ["$http", "$scope", "mainPageComm", ($http, $scope, mpc) => {

    mpc.setMusicCtrlSetDisplayHandler((displayName) => {
        $scope.nowDisplay = displayName;
    });

    $scope.nowDisplay = "search";

}]);

