import 'angular'

angular.module('mm-app').controller("SidebarController", ["$scope", "$http", "mainPageComm", ($scope, $http, comm) => {

    $scope.setDisplay = (displayName) => comm.musicCtrlSetDisplay(displayName);

    //$scope.username = "asdadg";
    //$scope.email = "";
    //$scope.loginStatus = "unlogin";
    // Common User Info Sections
    $scope.checkLogin = function () {
        $http({
            method: "GET",
            url: "/api/account/",
        }).then((response) => {
            $scope.username = response.data.username;
            console.log($scope.username);
            $scope.email = response.data.email;
            $scope.loginStatus = "login";
        }, (response) => {
            $scope.loginStatus = "unlogin";
        });
    };
    $scope.checkLogin();
    console.log($scope.username);
    // Login Sections
    $scope.loginPassword = "";
    $scope.loginUsername = "";
    $scope.login = () => {
        let d = {
            username: $scope.loginUsername,
            password: $scope.loginPassword
        };
        $http({
            method: "POST",
            url: "/api/account/login/",
            data: d
        }).then(() => {
            $scope.loginStatus = "successful";
            setTimeout(function () { window.location.reload(); }, 1500);
        }, () => {
            $scope.loginStatus = "failed";
            setTimeout(function () { loginStatus = "login"; }, 3000);
        });
    };
    $scope.logout = () => {
        $http({ method: "POST", url: "/api/account/logout/" }).then(function () { $scope.checkLogin(); });
    };
}]);