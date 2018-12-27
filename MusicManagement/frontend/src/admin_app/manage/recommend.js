import 'angular'
angular.module('mm-app').controller('RecommendController', ['$http', '$scope', 'FileUploader', '$cookies', 'djangoPage', 'mmNotification', ($http, $scope, FileUploader, $cookies, djangoPage, mmNotify) => {
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
        $scope.nowUploader.url = "/api/recommend/" + id + "/cover/";
        $scope.nowUploader.headers = { 'X-CSRFToken': $cookies.get("csrftoken") };
        $scope.isUploadSuccess = false;
    };
    $scope.nowUploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.isUploadSuccess = true;
        $scope.nowUploader.clearQueue();
    };
    // Query Sections
    $scope.pagination = new djangoPage('/api/recommend/');
    $scope.recommends = [];
    $scope.refreshRecommend = (url) => {
        $http({
            url: url,
            method: "GET"
        }).then(response => {
            $scope.recommends = $scope.pagination.filterResult(response);
        });
    };
    // Delete Sections
    $scope.deletingRecommend = null;
    $scope.toDeleteRecommend = recommend => {
        $scope.deletingRecommend = recommend;
    };
    $scope.deleteRecommend = id => {
        $http({
            url: "/api/recommend/" + id + "/",
            method: "DELETE"
        }).then(response => { 
            $scope.refreshRecommend($scope.pagination.refreshPage());
            $scope.deletingRecommend = null;
        }, response => {
            mmNotify.notify(response.status, response.statusText);
        });
    };
    // Add Sections
    $scope.addTitle = "";
    $scope.addDescription = "";
    $scope.addPlaylistId = "";
    $scope.addRecommend = () => {
        let d = {
            playlist_title: $scope.addTitle,
            description: $scope.addDescription,
            playlist: $scope.addPlaylistId
        }
        $http({
            url: "/api/recommend/",
            method: "POST",
            data: d
        }).then(response => {
            $scope.addTitle = "";
            $scope.addDescription = "";
            $scope.addPlaylistId = "";
            $scope.refreshRecommend($scope.pagination.refreshPage());
        }, response => {
            mmNotify.notify(response.status, response.statusText);
        });
    };
    // Update Sections
    $scope.editingRecommend = null;
    $scope.toEditRecommend = (recommend) => $scope.editingRecommend = recommend;
    $scope.editRecommend = () => {
        $http({
            url: "/api/recommend/" + $scope.editingRecommend.id + "/",
            method: "PUT",
            data: $scope.editingRecommend
        }).then(response => {
            $scope.editingRecommend = null;
            $scope.refreshRecommend($scope.pagination.refreshPage());
        }, response => {
            mmNotify.notify(response.status, response.statusText);
        });
    };

}]);