import 'angular'
import 'angular-audio'

angular.module('mm-app').controller("MusicController", ["$http", "$scope", ($http, $scope) => {

    $scope.nowDisplay = "search";

}]);