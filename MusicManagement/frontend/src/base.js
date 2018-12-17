import 'angular'
import 'angular-audio'
import 'angular-file-upload'
import 'angular-cookies'
import 'linqjs'
var app = angular.module('mm-app', ['ngAudio', 'angularFileUpload', 'ngCookies']);
app.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);
// Register global music interaction
app.factory('mmMusic', () => { 
    return () => {
        // Set Now Playing music
        this.setMusicPlaying = (music) => {
            this._onMusicChanged.forEach(e => {
                e();
            });
        };
        // Register On Music Change
        this.registerOnMusicChanged = (func) => this._onMusicChanged.push(func);
        this._onMusicChanged = [];
    };
});