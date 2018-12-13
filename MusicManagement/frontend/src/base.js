import 'angular'
import 'angular-audio'
import 'angular-file-upload'
import 'angular-cookies'

var app = angular.module('mm-app', ['ngAudio', 'angularFileUpload', 'ngCookies']);
app.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);