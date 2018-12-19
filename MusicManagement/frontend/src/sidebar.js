import 'angular'

angular.module('mm-app').controller("SidebarController", ["$scope", "$http", "mainPageComm", ($scope, $http, comm) => {

    $scope.setDisplay = (displayName) => comm.musicCtrlSetDisplay(displayName);

}]);