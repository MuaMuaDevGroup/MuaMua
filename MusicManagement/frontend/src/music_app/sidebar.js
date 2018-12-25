import 'angular'
import 'linqjs'

angular.module('mm-app').controller("SidebarController", ["$scope", "$http", "mainPageComm", "FileUploader", "$cookies", ($scope, $http, comm, FileUploader, $cookies) => {

    $scope.setDisplay = (displayName) => comm.musicCtrlSetDisplay(displayName);
    comm.setSidebarPlaylistRefreshHandler(() => {
        $scope.refreshPlaylist();
    });
    // Playlist Add Sections
    $scope.nowUploader = $scope.nowUploader = new FileUploader({ method: "POST" });
    $scope.nowUploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    $scope.nowUploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.nowUploader.clearQueue();
    };
    $scope.playlistAddDescription = "";
    $scope.playlistAddName = "";
    $scope.addPlaylist = () => {
        let d = {
            description: $scope.playlistAddDescription,
            name: $scope.playlistAddName,
            songs: []
        }
        $http({
            url: "/api/playlist/my/",
            method: "POST",
            data: d
        }).then(response => {
            $scope.nowUploader.url = "/api/playlist/my/" + response.data.id + "/cover/";
            $scope.nowUploader.headers = { 'X-CSRFToken': $cookies.get("csrftoken") };
            $scope.nowUploader.uploadAll();
            $scope.refreshPlaylist();
        });

    };

    // Common User Info Sections
    $scope.checkLogin = function () {
        $http({
            method: "GET",
            url: "/api/account/",
        }).then((response) => {
            $scope.username = response.data.username;
            $scope.email = response.data.email;
            $scope.loginStatus = "login";
        }, (response) => {
            $scope.loginStatus = "unlogin";
        });
    };
    $scope.checkLogin();
    // Login Sections
    $scope.loginPassword = "";
    $scope.loginUsername = "";
    $scope.login = () => {
        let d = {
            username: $scope.loginUsername,
            password: $scope.loginPassword
        };
        $http({
            method: "POST",
            url: "/api/account/login/",
            data: d
        }).then(() => {
            $scope.loginStatus = "successful";
            setTimeout(function () { window.location.reload(); }, 1500);
        }, () => {
            $scope.loginStatus = "failed";
            setTimeout(function () { loginStatus = "login"; }, 3000);
        });
    };
    $scope.logout = () => {
        $http({ method: "POST", url: "/api/account/logout/" }).then(function () { $scope.checkLogin(); });
    };

    // Info Edit Sections
    $scope.editUserId = null;
    $scope.editUsername = "";
    $scope.editEmail = "";
    $scope.editFirstName = "";
    $scope.editLastName = "";

    $scope.toEditUserDetail = () => {
        $http({
            method: "GET",
            url: "/api/account/"
        }).then((response) => {
            let m = response.data;
            $scope.editUserId = m.id;
            $scope.editUsername = m.username;
            $scope.editEmail = m.email;
            $scope.editFirstName = m.first_name;
            $scope.editLastName = m.last_name;
        });
        $http({
            method: "GET",
            url: "/api/account/"
        }).then((response) => {
            let m = response.data;
            $scope.editUserId = m.id;
            $scope.editUsername = m.username;
            $scope.editEmail = m.email;
            $scope.editFirstName = m.first_name;
            $scope.editLastName = m.last_name;
        });
    };
    $scope.editUserDetail = () => {
        let u = "/api/account/";

        let d = {
            id: $scope.editUserId,
            username: $scope.editUsername,
            email: $scope.editEmail,
            first_name: $scope.editFirstName,
            last_name: $scope.editLastName,
        };
        $http({
            url: u,
            method: "PUT",
            data: d
        }).then((response) => {
            $scope.editUserId = null;
            $scope.editUsername = "";
            $scope.editEmail = "";
            $scope.editFirstName = "";
            $scope.editLastName = "";
        });
    };
    // Playlist Sections
    $scope.playlists = [];
    $scope.favoritePlaylist = null;
    $scope.refreshPlaylist = () => {
        $http({
            url: "/api/playlist/my/",
            method: "GET"
        }).then(response => {
            $scope.playlists = [];
            response.data.forEach(e => {
                if (e.name != "我喜欢的歌曲")
                    $scope.playlists.push(e);
                else
                    $scope.favoritePlaylist = e;
            });
        });
    };
    $scope.viewPlaylist = playlist => {
        comm.playlistViewCtrlSetDisplay(playlist.id, "playlist");
        comm.musicCtrlSetDisplay('playlist_view');
    };
    $scope.refreshPlaylist();
}]);