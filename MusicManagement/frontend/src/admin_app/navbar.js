import $ from 'jquery'
import 'angular'
import 'linqjs'
angular.module('mm-app').controller('NavbarController', ["$http", "$scope", "mmNotification", function ($http, $scope, mmNotify) {
    //Bind Notification
    //Initialize 
    //
    $scope.notifyCount = 0;
    let typeStatus = [
        { status: 400, text: "请求参数有误，可能是填写的内容不完整" },
        { status: 404, text: "找不到指定对象" },
        { status: 403, text: "访问被禁止，您可能尚未登录或未拥有此操作的权限" },
        { status: 401, text: "您尚未登录，若您正在登录，可能是用户名和密码错误" }
    ]
    let convertToTitle = (statusCode) => {
        switch (parseInt(statusCode / 100)) {
            case 2:
                return "成功";
            case 4:
                return "操作错误";
            case 5:
                return "服务器错误";
            default:
                return "未知状态";
        }
    };
    $scope.currentNotifications = [];
    mmNotify.setNotificationHandler((type, message, time) => {
        $scope.notifyCount++;
    });
    $scope.notifyClick = () => {
        $scope.currentNotifications = [];
        mmNotify.notifications().forEach(e => {
            e.statusText = typeStatus.first(p => p.status == e.type).text;
            $scope.currentNotifications.push(e);
        });
        $scope.notifyCount = 0;
    };

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
    $scope.loginCaptchaCode = "";
    $scope.loginCaptchaHash = "";
    $scope.loginCaptchaImage = "";
    $scope.username = "111";
    $scope.email = "111";
    $scope.isLogin = false;
    $scope.getCaptcha = () => {
        $http({
            url: "/api/account/captcha/",
            method: "POST"
        }).then(response => {
            $scope.loginCaptchaHash = response.data.key
            $scope.loginCaptchaImage = response.data.image
        });
    }
    $scope.login = function () {
        let d = {
            username: $scope.loginUsername,
            password: $scope.loginPassword,
            validation_code: $scope.loginCaptchaCode,
            validation_hash: $scope.loginCaptchaHash
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
            $scope.getCaptcha();
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