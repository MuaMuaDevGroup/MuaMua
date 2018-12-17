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
    let nowMusic = null;
    let onMusicChanged = [];
    return {
        // Set Now Playing music
        setMusicPlaying: (music) => {
            onMusicChanged.forEach(e => {
                e(music);
            });
        },
        // Get Now Playing music
        getMusicPlaying : () => nowMusic,
        // Register On Music Change
        registerOnMusicChanged : (func) => onMusicChanged.push(func)
    };
});