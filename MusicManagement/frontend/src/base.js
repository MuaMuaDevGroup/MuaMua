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
    let onMusicChanged = null;
    return {
        // Set Now Playing music
        setMusicPlaying: (music) => {
            nowMusic = music;
            if (onMusicChanged != null)
                onMusicChanged(music);
        },
        // Get Now Playing music
        getMusicPlaying: () => {
            return nowMusic;
        },
        // Register On Music Change
        registerOnMusicChanged: (func) => onMusicChanged = func
    };
});