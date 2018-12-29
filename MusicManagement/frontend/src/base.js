import 'angular'
import 'angular-audio'
import 'angular-file-upload'
import 'angular-cookies'
import 'angular-animate'
import 'linqjs'
var app = angular.module('mm-app', ['ngAudio', 'angularFileUpload', 'ngCookies', 'ngAnimate']);
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
    let sidebarPlaylistRefreshHandler = null;
    let registerPageGetCaptchaHandler = null;
    let getLoginStateHandler = null;
    let refreshCollectionPageHandler = null;
    return {
        // Switch Views of Music
        musicCtrlSetDisplay: (displayName) => {
            if (typeof musicCtrlSetDisplayHandler == "function")
                musicCtrlSetDisplayHandler(displayName);
        },
        setMusicCtrlSetDisplayHandler: (func) => {
            musicCtrlSetDisplayHandler = func;
        },
        // Switch playlist or album in playlist_view
        playlistViewCtrlSetDisplay: (albumOrPlaylistId, displayName) => {
            if (typeof playlistViewCtrlSetDisplayHandler == "function")
                playlistViewCtrlSetDisplayHandler(albumOrPlaylistId, displayName);
        },
        setPlaylistViewCtrlSetDisplayerHandler: (func) => {
            playlistViewCtrlSetDisplayHandler = func;
        },
        // Refresh Sidebar to load playlist
        sidebarPlaylistRefresh: () => {
            if (typeof sidebarPlaylistRefreshHandler == "function")
                sidebarPlaylistRefreshHandler();
        },
        setSidebarPlaylistRefreshHandler: (func) => {
            sidebarPlaylistRefreshHandler = func;
        },
        // Refresh Captcha when goto registration page
        registerPageGetCaptcha: () => {
            if (typeof registerPageGetCaptchaHandler == "function")
                registerPageGetCaptchaHandler();
        },
        setRegisterPageGetCaptchaHandler: (func) => {
            registerPageGetCaptchaHandler = func;
        },
        // Get Login State
        setGetLoginStateHandler: (func) => {
            getLoginStateHandler = func;
        },
        getLoginState: () => {
            if (typeof getLoginStateHandler == "function")
                return getLoginStateHandler();
        },
        // Refresh Collection page
        setRefreshCollectionPageHandler: (func) => {
            refreshCollectionPageHandler = func;
        },
        refreshCollectionPage: () => {
            if (typeof refreshCollectionPageHandler == "function")
                refreshCollectionPageHandler();
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