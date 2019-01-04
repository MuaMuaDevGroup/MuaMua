import 'angular'
import 'linqjs'

angular.module('mm-app').controller('UserManageController', ['$http', '$scope', 'djangoPage', 'mmNotification', ($http, $scope, djangoPage, mmNotify) => {
    //Refresh User sections
    $scope.users = [];
    $scope.pagination = new djangoPage("/api/user/")
    $scope.refreshUser = (url) => {
        $http({
            url: url,
            method: "GET"
        }).then(response => {
            $scope.users = $scope.pagination.filterResult(response);
        });
    };
    //Add user sections
    $scope.addUserName = "";
    $scope.addUserPass = "";
    $scope.addUserEmail = "";
    $scope.addUserFirstname = "";
    $scope.addUserLastname = "";
    $scope.addUserIsAdminRaw = "false";
    $scope.addUser = () => {
        let d = {
            username: $scope.addUserName,
            password: $scope.addUserPass,
            email: $scope.addUserEmail,
            first_name: $scope.addUserFirstname,
            last_name: $scope.addUserLastname,
            is_admin: $scope.addUserIsAdminRaw == "true" ? true : false
        };
        $http({
            method: "POST",
            url: "/api/user/",
            data: d
        }).then(response => {
            $scope.addUserName = "";
            $scope.addUserPass = "";
            $scope.addUserEmail = "";
            $scope.addUserFirstname = "";
            $scope.addUserLastname = "";
            $scope.addUserIsAdminRaw = "false";
            $scope.refreshUser($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });

    };
    //Edit user sections
    $scope.editUser = null;
    $scope.toEditUser = (id) => {
        $http({ url: "/api/user/" + id + "/", method: "GET" }).then(response => {
            $scope.editUser = response.data;
            $scope.editUser.isAdminRaw = $scope.editUser.is_staff == true ? "true" : "false";
            $scope.editUser.isActiveRaw = $scope.editUser.is_active == true ? "true" : "false";
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.editUserDo = () => {
        let d = {
            email: $scope.editUser.email,
            first_name: $scope.editUser.first_name,
            last_name: $scope.editUser.last_name,
            is_admin: $scope.editUser.isAdminRaw = $scope.editUser.isAdminRaw == "true" ? true : false,
            is_active: $scope.editUser.isActiveRaw = $scope.editUser.isActiveRaw == "true" ? true : false
        };
        $http({
            url: "/api/user/" + $scope.editUser.id + "/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.editUser = null;
            $scope.refreshUser($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    //Edit password sections
    $scope.editPassId = "";
    $scope.editPassName = "";
    $scope.editPassNew = "";
    $scope.toEditPass = (id, name) => {
        $scope.editPassId = id;
        $scope.editPassName = name;
    };
    $scope.editPass = () => {
        let d = {
            new_password: $scope.editPassNew
        };
        $http({
            url: "/api/user/" + $scope.editPassId + "/password/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.editPassId = "";
            $scope.editPassName = "";
            $scope.editPassNew = "";
            $scope.refreshUser($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
}]);
