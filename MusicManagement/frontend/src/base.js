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

// Register Main Page Communication Service
angular.module('mm-app').factory("mainPageComm", () => {
    let musicCtrlSetDisplayHandler = null;
    let playlistViewCtrlSetDisplayHandler = null;
    return {
        musicCtrlSetDisplay: (displayName) => {
            if (typeof musicCtrlSetDisplayHandler == "function")
                musicCtrlSetDisplayHandler(displayName);
        },
        setMusicCtrlSetDisplayHandler: (func) => {
            musicCtrlSetDisplayHandler = func;
        },
        playlistViewCtrlSetDisplay: (albumOrPlaylistId, displayName) => {
            if (typeof playlistViewCtrlSetDisplayHandler == "function")
                playlistViewCtrlSetDisplayHandler(albumOrPlaylistId, displayName);
        },
        setPlaylistViewCtrlSetDisplayerHandler: (func) => {
            playlistViewCtrlSetDisplayHandler = func;
        }
    };
});

//Register musicTime filter
angular.module('mm-app').filter("musicTime", () => {
    return (input) => {
        if ((typeof input) != "number")
            return "00:00";
        let padding = (data) => {
            let t = data.toString();
            if (t.length != 2)
                t = "0" + t;
            return t;
        };
        let hour = input / 3600;
        hour = parseInt(hour);
        let minute = (input - hour * 60) / 60;
        minute = parseInt(minute);
        let second = (input - minute * 60 - hour * 3600);
        second = parseInt(second);
        let format = "";
        if (hour != 0)
            format += padding(hour) + ":";
        format += padding(minute) + ":" + padding(second);
        return format;
    };
});