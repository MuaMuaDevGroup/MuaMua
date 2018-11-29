import $ from 'jquery'
import 'angular'
angular.module('mm-app', []).controller('NavbarController', ["$http", "$scope", function ($http, $scope) {
    $scope.checkLogin = function () {
        $http({
            method: "GET",
            url: "/api/account/",
        }).then(function (response) {
            $scope.username = response.data.username;
            $scope.email = response.data.email;
            $scope.isLogin = true;
            $scope.$apply();
        }, function (response) {
            $scope.isLogin = false;
        });
    };
    $scope.checkLogin();
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
            $("#navbar-login-success-box").show();
            setTimeout(function () { window.location.reload(); }, 1500);
            $scope.checkLogin();
        }, function () {
            $("#navbar-login-error-box").show();
            setTimeout(function () { $("#navbar-login-error-box").hide(); }, 3000);
        });
    };
    $scope.logout = function () {
        $http({ method: "POST", url: "/api/account/logout/" }).then(function () { $scope.checkLogin(); });
    };
}]).config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);