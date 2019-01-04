import 'angular'
angular.module('mm-app').controller('ArtistManageController', ['$http', '$scope', 'FileUploader', '$cookies', 'djangoPage', 'mmNotification', ($http, $scope, FileUploader, $cookies, djangoPage, mmNotify) => {
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
        $scope.nowUploader.url = "/api/artist/" + id + "/photo/";
        $scope.nowUploader.headers = { 'X-CSRFToken': $cookies.get("csrftoken") };
        $scope.isUploadSuccess = false;
    };
    $scope.nowUploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.isUploadSuccess = true;
        $scope.nowUploader.clearQueue();
    };
    //Queries Sections
    $scope.artists = [];
    $scope.pagination = new djangoPage('/api/artist/')
    $scope.refreshArtist = (url) => {
        $http({
            method: "GET",
            url: url
        }).then((response) => {
            $scope.artists = $scope.pagination.filterResult(response);
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.addArtistName = "";
    $scope.addArtistCountry = "";
    $scope.addArtistBirth = "";
    $scope.addArtist = () => {
        let d = {
            name: $scope.addArtistName,
            country: $scope.addArtistCountry,
            birth: $scope.addArtistBirth
        }
        $http({
            method: "POST",
            url: "/api/artist/",
            data: d
        }).then((response) => {
            $scope.addArtistName = "";
            $scope.addArtistBirth = "";
            $scope.addArtistCountry = "";
            $scope.refreshArtist($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.editArtistId = null;
    $scope.editArtistName = "";
    $scope.editArtistCountry = "";
    $scope.editArtistBirth = "";
    $scope.toEditArtist = (id, name, country, birth) => {
        $scope.editArtistId = id;
        $scope.editArtistName = name;
        $scope.editArtistCountry = country;
        $scope.editArtistBirth = birth;
    };
    $scope.editArtist = () => {
        let u = "/api/artist/" + $scope.editArtistId + "/";
        let d = {
            name: $scope.editArtistName,
            country: $scope.editArtistCountry,
            birth: $scope.editArtistBirth
        };
        $http({
            url: u,
            method: "PUT",
            data: d
        }).then((response) => {
            $scope.editArtistId = null;
            $scope.editArtistName = "";
            $scope.editArtistCountry = "";
            $scope.editArtistBirth = "";
            $scope.refreshArtist($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    // Delete Sections
    $scope.deletingArtist = null;
    $scope.deleteArtist = id => {
        $http({
            url: "/api/artist/" + id + "/",
            method: "DELETE"
        }).then(response => {
            $scope.deletingArtist = null;
            $scope.refreshArtist($scope.pagination.refreshPage());
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
    $scope.toDeleteArtist = artist => $scope.deletingArtist = artist;
}]);
