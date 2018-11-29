import 'angular'

angular.module('mm-app').controller('ManageController', ['$http', '$scope', ($http, $scope) => {
    $scope.artists = [];
    $scope.refreshArtist = () => {
        $http({
            method: "GET",
            url: "http://127.0.0.1:8000/api/artist/"
        }).then((response) => {
            $scope.artists = response.data;
            console.log($scope.artists);
            $scope.$apply();
        });
    };
}])