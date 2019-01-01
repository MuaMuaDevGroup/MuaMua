import 'angular'
import 'linqjs'
angular.module('mm-app').controller('MusicManageController', ['$http', '$scope', 'ngAudio', 'FileUploader', '$cookies', 'djangoPage', 'mmNotification', ($http, $scope, ngAudio, FileUploader, $cookies, djangoPage, mmNotify) => {
    //File Upload
    var nowUploader = $scope.nowUploader = $scope.nowUploader = new FileUploader({ method: "POST" });
    $scope.nowUploadingId = null;
    $scope.nowUploadingFilename = "";
    $scope.isUploadSuccess = false;
    $scope.setUploadId = (id) => {
        $scope.nowUploadingId = id;
        $scope.nowUploader.url = "/api/music/" + id + "/file/";
        $scope.nowUploader.headers = { 'X-CSRFToken': $cookies.get("csrftoken") };
        $scope.isUploadSuccess = false;
    };
    $scope.nowUploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.isUploadSuccess = true;
        $scope.nowUploader.clearQueue();
    };
    //Pagination Sections

    //Query Sections
    $scope.musics = [];
    $scope.pagination = new djangoPage("/api/music/");
    $scope.refreshMusic = (url) => {
        $http({
            method: "GET",
            url: url
        }).then((response) => {
            $scope.musics = $scope.pagination.filterResult(response);
            $scope.musics.forEach(m => {
                //add audio
                //if (m.entity != null)
                //    m.audio = ngAudio.load(m.entity);
                m.artistNames = [];
                m.artist.forEach(a => {
                    $http({ method: "GET", url: "/api/artist/" + a + "/" }).then((response) => { m.artistNames.push(response.data.name); });
                });
                if (m.album != null)
                    $http({ method: "GET", url: "/api/album/" + m.album + "/" }).then(response => m.AlbumName = response.data.title);
            });
        });
    };
    $scope.loadEntityMusic = (url) => ngAudio.load(url);
    //Add Sections
    $scope.addStyle = "";
    $scope.addDuration = "";
    $scope.addMusicTitle = "";
    $scope.addRawArtists = "";
    $scope.addMusicAlbum = "";
    $scope.addMusic = () => {
        let d = {
            id: $scope.addMusicId,
            style: $scope.addStyle,
            duration: $scope.addDuration,
            title: $scope.addMusicTitle,
            artist: $scope.addRawArtists == "" ? null : $scope.addRawArtists.split(",").select(t => parseInt(t)),
            album: $scope.addMusicAlbum == "" ? null : parseInt($scope.addMusicAlbum)
        }
        $http({
            method: "POST",
            url: "/api/music/",
            data: d
        }).then((response) => {
            $scope.addStyle = "";
            $scope.addDuration = "";
            $scope.addMusicTitle = "";
            $scope.addRawArtists = "";
            $scope.addMusicAlbum = "";
            $scope.refreshMusic($scope.pagination.resetPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.editMusicId = null;
    $scope.editMusicStyle = "";
    $scope.editMusicDuration = "";
    $scope.editMusicTitle = "";
    $scope.editMusicRawArtists = "";
    $scope.editMusicAlbum = "";

    $scope.toEditMusic = (id) => {
        let m = $scope.musics.first(m => m.id == id);
        $scope.editMusicId = m.id;
        $scope.editMusicStyle = m.style;
        $scope.editMusicDuration = m.duration;
        $scope.editMusicTitle = m.title;
        $scope.editMusicRawArtists = m.artist.join(",");
        $scope.editMusicAlbum = m.album;
    };
    $scope.editMusic = () => {
        let u = "/api/music/" + $scope.editMusicId + "/";
        let d = {
            id: $scope.editMusicId,
            style: $scope.editMusicStyle,
            duration: $scope.editMusicDuration,
            title: $scope.editMusicTitle,
            artist: $scope.editMusicRawArtists == "" ? null : ($scope.editMusicRawArtists.split(",").select(t => parseInt(t))),
            album: $scope.editMusicAlbum == "" ? null : parseInt($scope.editMusicAlbum)
        }
        $http({
            url: u,
            method: "PUT",
            data: d
        }).then((response) => {
            $scope.editMusicId = null;
            $scope.editStyle = "";
            $scope.editDuration = "";
            $scope.editMusicTitle = "";
            $scope.editMusicRawArtists = "";
            $scope.editMusicAlbum = "";
            $scope.refreshMusic($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    // Delete Sections
    $scope.deletingMusic = null;
    $scope.toDeleteMusic = (music) => $scope.deletingMusic = music;
    $scope.deleteMusic = (id) => {
        $http({
            url: "/api/music/" + id + "/",
            method: "DELETE"
        }).then(response => {
            $scope.deletingMusic = null;
            $scope.refreshMusic($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
}]);
