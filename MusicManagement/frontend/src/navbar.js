import $ from 'jquery'
import 'angular'
angular.module('mm-app', []).controller('NavbarController', ['$scope', function ($scope) {
    $scope.loginUsername = "";
    $scope.loginPassword = "";
    $scope.login = function () {
        alert("d");
        let d = {
            username: this.loginUsername,
            password: this.loginPassword
        };
        $.post({
            url: "/api/account/login/",
            data: d,
            statusCode: {
                204: alert("OK")
            },
            error: () => {
                alert("Error");
            }
        });
    };
}]);