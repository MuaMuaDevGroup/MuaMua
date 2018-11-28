import $ from 'jquery'
import 'angular'

angular.module('mm-app', []).controller('NavbarController', ["$http", "$scope", function ($http, $scope) {
    $scope.loginUsername = "";
    $scope.loginPassword = "";
    $scope.username = "111";
    $scope.email = "111";
    $scope.isLogin = false;
    $scope.login = function () {
        let d = {
            username: $scope.loginUsername,
            password: $scope.loginPassword
        };
        $http({
            method: "POST",
            url: "/api/account/login/",
            data: d
        }).then(function () {
            $scope.isLogin = true;
            $http({
                method: "GET",
                url: "/api/account/",
            }).then(function (response) {
                $scope.username = response.data.username;
                $scope.email = response.data.email;
                $scope.$apply();
            });
        }, function () {
            $("#navbar-login-error-box").show();
            setTimeout(function () { $("#navbar-login-error-box").hide(); }, 3000);
        });
    };
}]);