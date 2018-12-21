import 'angular'

angular.module('mm-app').controller("SidebarController", ["$scope", "$http", "mainPageComm", ($scope, $http, comm) => {

    $scope.setDisplay = (displayName) => comm.musicCtrlSetDisplay(displayName);
    // Common User Info Sections
    $scope.checkLogin = function () {
        $http({
            method: "GET",
            url: "/api/account/",
        }).then((response) => {
            $scope.username = response.data.username;
            $scope.email = response.data.email;
            $scope.loginStatus = "login";
        }, (response) => {
            $scope.loginStatus = "unlogin";
        });
    };
    $scope.checkLogin();
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
    
    // Info Edit Sections
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