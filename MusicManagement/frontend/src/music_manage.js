import 'angular'

angular.module('mm-app').controller('ManageController', ['$http', '$scope', ($http, $scope) => {
    $scope.artists = [];
    $scope.refreshArtist = () => {
        $http({
            method: "GET",
            url: "/api/artist/"
        }).then((response) => {
            $scope.artists = response.data;
            console.log($scope.artists);
            $scope.$apply();
        });
    };
    $scope.addArtistName = "";
    $scope.addArtistCountry = "";
    $scope.addArtistBirth = "";
    $scope.addArtist = () => {
        Date.parse()
        let d = {
            name: $scope.addArtistName,
            country: $scope.addArtistCountry,
            birth: $scope.addArtistBirth
        }
        $http({
            method: "POST",
            url: "/api/artist/",
            data: d
        }).then((response) => {
            $scope.addArtistName = "";
            $scope.addArtistBirth = "";
            $scope.addArtistCountry = "";
            $scope.refreshArtist();
        });
    };
}])