import $ from 'jquery'
import 'angular'

angular.module('mm-app').controller('NavbarController', ["$http", "$scope", function ($http, $scope) {
    $scope.checkLogin = function () {
        $http({
            method: "GET",
            url: "/api/account/",
        }).then(function (response) {
            $scope.username = response.data.username;
            $scope.email = response.data.email;
            $scope.isLogin = true;
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

    // Account Detail Edit
    $scope.editUserId = null;
    $scope.editUsername = "";
    $scope.editEmail = "";
    $scope.editFirstName = "";
    $scope.editLastName = "";

    $scope.toEditUserDetail = () => {
        $http({
            method: "GET",
            url: "/api/account/"
        }).then((response) => {
            let m = response.data;
            $scope.editUserId = m.id;
            $scope.editUsername = m.username;
            $scope.editEmail = m.email;
            $scope.editFirstName = m.first_name;
            $scope.editLastName = m.last_name;
        });
        $http({
            method: "GET",
            url: "/api/account/"
        }).then((response) => {
            let m = response.data;
            $scope.editUserId = m.id;
            $scope.editUsername = m.username;
            $scope.editEmail = m.email;
            $scope.editFirstName = m.first_name;
            $scope.editLastName = m.last_name;
        });
    };
    $scope.editUserDetail = () => {
        let u = "/api/account/";
        console.log($scope.editUserId);
        let d = {
            id: $scope.editUserId,
            username: $scope.editUsername,
            email: $scope.editEmail,
            first_name: $scope.editFirstName,
            last_name: $scope.editLastName,
        };
        $http({
            url: u,
            method: "PUT",
            data: d
        }).then((response) => {
            $scope.editUserId = null;
            $scope.editUsername = "";
            $scope.editEmail = "";
            $scope.editFirstName = "";
            $scope.editLastName = "";
        });
    };
}]);