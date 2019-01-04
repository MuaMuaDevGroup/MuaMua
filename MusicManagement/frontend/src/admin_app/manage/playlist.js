import 'angular'
import 'linqjs'
angular.module('mm-app').controller('PlaylistManageController', ['$http', '$scope', 'FileUploader', '$cookies', 'djangoPage', "mmNotification", ($http, $scope, FileUploader, $cookies, djangoPage, mmNotify) => {

    //File Upload Sections
    $scope.nowUploader = $scope.nowUploader = new FileUploader({ method: "POST" });
    $scope.nowUploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    $scope.nowUploadingId = null;
    $scope.nowUploadingFilename = "";
    $scope.isUploadSuccess = false;
    $scope.setUploadId = (id) => {
        $scope.nowUploader.clearQueue();
        $scope.nowUploadingId = id;
        $scope.nowUploader.url = "/api/playlist/" + id + "/cover/";
        $scope.nowUploader.headers = { 'X-CSRFToken': $cookies.get("csrftoken") };
        $scope.isUploadSuccess = false;
    };
    $scope.nowUploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.isUploadSuccess = true;
        $scope.nowUploader.clearQueue();
    };
    //Query Playlist
    $scope.playlists = [];
    $scope.pagination = new djangoPage('/api/playlist/');
    $scope.refreshPlaylists = (url) => {
        $http({
            url: url,
            method: "GET"
        }).then(response => {
            $scope.playlists = $scope.pagination.filterResult(response);
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.viewSongPlaylist = [];
    $scope.loadPlaylistTrack = (id) => {
        let playlist = $scope.playlists.first(p => p.id == id);
        $http({
            url: "/api/playlist/" + id + "/",
            method: "GET"
        }).then(response => {
            $scope.viewSongPlaylist = [];
            response.data.songs.forEach(p => {
                $http({
                    url: "/api/music/" + p + "/",
                    method: "GET"
                }).then(response => { $scope.viewSongPlaylist.push(response.data); });
            });
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.loadPlaylistDescription = (id) => {
        let playlist = $scope.playlists.first(p => p.id == id);
        let i = $scope.playlists.indexOf(playlist);
        $http({
            url: "/api/playlist/" + id + "/",
            method: "GET"
        }).then(response => {
            $scope.playlists[i] = response.data;
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    //Add Playlist sections
    $scope.addPlaylistTitle = "";
    $scope.addPlaylistDescription = "";
    $scope.addPlaylistTracks = "";
    $scope.addPlaylistOwner = "";
    $scope.addPlaylist = () => {
        let d = {
            name: $scope.addPlaylistTitle,
            description: $scope.addPlaylistDescription,
            owner: $scope.addPlaylistOwner,
            songs: $scope.addPlaylistTracks == "" ? [] : $scope.addPlaylistTracks.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/playlist/",
            method: "POST",
            data: d
        }).then(response => {
            $scope.addPlaylistTitle = "";
            $scope.addPlaylistDescription = "";
            $scope.addPlaylistTracks = "";
            $scope.addPlaylistOwner = "";
            $scope.refreshPlaylists($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    //Edit playlist sections
    $scope.editingPlaylist = null;
    $scope.toEditPlaylist = (id) => {
        $http({
            url: "/api/playlist/" + id + "/",
            method: "GET"
        }).then(response => {
            $scope.editingPlaylist = response.data;
            $scope.editingPlaylist.rawSongs = response.data.songs.join(",")
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.editPlaylist = () => {
        let d = {
            name: $scope.editingPlaylist.name,
            description: $scope.editingPlaylist.description,
            play_count: $scope.editingPlaylist.play_count,
            owner: $scope.editingPlaylist.owner,
            songs: $scope.editingPlaylist.rawSongs == "" ? [] : $scope.editingPlaylist.rawSongs.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/playlist/" + $scope.editingPlaylist.id + "/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.editingPlaylist = null;
            $scope.refreshPlaylists($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    //Delete playlist sections
    $scope.deletingPlaylist = null;
    $scope.setDeletePlaylistId = (id) => {
        $scope.deletingPlaylist = $scope.playlists.first(p => p.id == id);
    };
    $scope.deletePlaylist = (id) => {
        $http({
            url: "/api/playlist/" + id + "/",
            method: "DELETE"
        }).then(response => {
            $scope.deletingPlaylist = null;
            $scope.refreshPlaylists($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    //Edit collector sections
    $scope.collectorAddUserUserRaw = "";
    $scope.collectorAddUserId = null;
    $scope.addCollector = () => {
        if ($scope.collectorAddUserUserRaw == "") return;
        let d = {
            collectors: $scope.collectorAddUserUserRaw.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/playlist/" + $scope.collectorAddUserId + "/collector/",
            method: "POST",
            data: d
        }).then(response => {
            $scope.collectorAddUserUserRaw = "";
            $scope.collectorAddUserId = null;
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.setCollectorAdd = (id) => $scope.collectorAddUserId = id;
    $scope.collectorRemoveUserUserRaw = "";
    $scope.collectorRemoveUserId = null;
    $scope.removeCollector = () => {
        if ($scope.collectorRemoveUserUserRaw == "") return;
        let d = {
            collectors: $scope.collectorRemoveUserUserRaw.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/playlist/" + $scope.collectorRemoveUserId + "/collector/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.collectorRemoveUserUserRaw = "";
            $scope.collectorRemoveUserId = null;
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.setCollectorRemove = (id) => $scope.collectorRemoveUserId = id;
}]);
