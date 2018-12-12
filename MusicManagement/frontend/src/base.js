import 'angular'
import 'angular-audio'

var app = angular.module('mm-app', ['ngAudio']);
app.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);