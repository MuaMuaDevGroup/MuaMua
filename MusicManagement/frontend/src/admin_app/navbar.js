import $ from 'jquery'
import 'bootstrap'
import 'angular'
import 'linqjs'
angular.module('mm-app').controller('NavbarController', ["$http", "$scope", "mmNotification", function ($http, $scope, mmNotify) {
    //Bind Notification
    $scope.notifyCount = 0;
    $scope.notifications = [];
    $scope.typeStatus = [
        { status: 400, text: "请求参数有误，可能是填写的内容不完整" },
        { status: 404, text: "找不到指定对象" },
        { status: 403, text: "访问被禁止，您可能尚未登录或未拥有此操作的权限" },
        { status: 401, text: "您尚未登录，若您正在登录，可能是用户名和密码错误" }
    ]
    mmNotify.setNotificationHandler((type, message) => {

        $scope.notifyCount = mmNotify.notifications().length;
        $scope.notifications.unshift({
            message: $scope.typeStatus.first(p => p.status == type).text,
            isShow: true
        });
        if ($scope.notifications.length > 3)
            $scope.notifications.pop();
    });

    //Login Sections
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