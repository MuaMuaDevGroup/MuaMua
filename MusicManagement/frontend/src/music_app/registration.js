import 'angular'

angular.module('mm-app').controller("RegistrationController", ["$http", "$scope", "mainPageComm", ($http, $scope, comm) => {
    comm.setRegisterPageGetCaptchaHandler(() => {
        $scope.getCaptcha();
    });
    $scope.regUsername = "";
    $scope.regPassword = "";
    $scope.regEmail = "";
    $scope.regFirstname = "";
    $scope.regLastname = "";
    $scope.regValidationImage = "";
    $scope.regValidationCode = "";
    $scope.regValidationHash = "";
    $scope.errorText = "";
    $scope.isSuccess = false;
    $scope.getCaptcha = () => {
        $http({
            url: "/api/account/captcha/",
            method: "POST"
        }).then(response => {
            $scope.regValidationHash = response.data.key
            $scope.regValidationImage = response.data.image
        });
    }
    $scope.registerUser = () => {
        let d = {
            username: $scope.regUsername,
            password: $scope.regPassword,
            email: $scope.regEmail,
            first_name: $scope.regFirstname,
            last_name: $scope.regLastname,
            validation_hash: $scope.regValidationHash,
            validation_code: $scope.regValidationCode
        };
        $http({
            url: "/api/account/registration/",
            method: "POST",
            data: d
        }).then(response => {
            $scope.isSuccess = true;
            setTimeout(() => window.location.reload(), 3000);
        }, response => {
                if (response.data.message == "")
                    $scope.errorText = "验证码错误，请重试";
                else
                    $scope.errorText = response.data.message;
                $scope.getCaptcha();
        });
    };
}]);