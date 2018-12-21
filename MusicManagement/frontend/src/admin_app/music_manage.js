import 'angular'
import 'linqjs'
import 'angular-audio'
import 'angular-file-upload'

angular.module('mm-app').controller('MusicManageController', ['$http', '$scope', 'ngAudio', 'FileUploader', '$cookies', ($http, $scope, ngAudio, FileUploader, $cookies) => {
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
    //Query Sections
    $scope.musics = [];
    $scope.refreshMusic = () => {
        $http({
            method: "GET",
            url: "/api/music"
        }).then((response) => {
            $scope.musics = response.data;
            $scope.musics.forEach(m => {
                //add audio
                if (m.entity != null)
                    m.audio = ngAudio.load(m.entity);
                m.artistNames = [];
                m.artist.forEach(a => {
                    $http({ method: "GET", url: "/api/artist/" + a + "/" }).then((response) => { m.artistNames.push(response.data.name); });
                });
                if (m.album != null)
                    $http({ method: "GET", url: "/api/album/" + m.album + "/" }).then(response => m.AlbumName = response.data.title);
            });
        });
    };
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
            $scope.refreshMusic();
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
            $scope.refreshMusic();
        });
    };
}]);

angular.module('mm-app').controller('ArtistManageController', ['$http', '$scope', 'FileUploader', '$cookies', ($http, $scope, FileUploader, $cookies) => {
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
    $scope.refreshArtist = () => {
        $http({
            method: "GET",
            url: "/api/artist/"
        }).then((response) => {
            $scope.artists = response.data;
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
            $scope.refreshArtist();
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
            $scope.refreshArtist();
        });
    };
}]);

angular.module('mm-app').controller('AlbumManageController', ['$http', '$scope', 'FileUploader', '$cookies', ($http, $scope, FileUploader, $cookies) => {
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
        $scope.nowUploader.url = "/api/album/" + id + "/cover/";
        $scope.nowUploader.headers = { 'X-CSRFToken': $cookies.get("csrftoken") };
        $scope.isUploadSuccess = false;
    };
    $scope.nowUploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.isUploadSuccess = true;
        $scope.nowUploader.clearQueue();
    };
    // Queries Sections
    $scope.albums = [];
    $scope.viewTracksAlbum = null;
    $scope.refreshAlbums = () => {
        $http({
            url: "/api/album/",
            method: "GET"
        }).then(response => {
            $scope.albums = response.data;
            $scope.albums.forEach(a => a.tracks = []);
        });

    };
    $scope.editingAlbum = null;
    $scope.toEditAlbum = (id) => {
        $scope.editingAlbum = $scope.albums.first(a => a.id == id);
        $http({
            url: "/api/album/" + $scope.editingAlbum.id + "/",
            method: "GET"
        }).then(response => {
            $scope.editingAlbum.rawTracks = response.data.tracks.select(a => a.toString()).join(",");
        });
    };
    $scope.editAlbum = () => {
        let d = {
            title: $scope.editingAlbum.title,
            publisher: $scope.editingAlbum.publisher,
            year: $scope.editingAlbum.year,
            description: $scope.editingAlbum.description,
            tracks: $scope.editingAlbum.rawTracks == "" ? null : $scope.editingAlbum.rawTracks.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/album/" + $scope.editingAlbum.id + "/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.refreshAlbums();
        });
    };

    $scope.deletingAlbum = null;
    $scope.setDeleteId = (id) => {
        $scope.deletingAlbum = $scope.albums.first(a => a.id == id);
    };
    $scope.deleteAlbum = (id) => {
        $http({
            url: "/api/album/" + id + "/",
            method: "DELETE"
        }).then(response => {
            $scope.refreshAlbums();
        });
    };
    $scope.addAlbumTitle = "";
    $scope.addAlbumPublisher = "";
    $scope.addAlbumYear = "";
    $scope.addAlbumTracks = "";
    $scope.addAlbumDescription = "";
    $scope.addAlbum = () => {
        let d = {
            title: $scope.addAlbumTitle,
            publisher: $scope.addAlbumPublisher,
            year: $scope.addAlbumYear,
            description: $scope.addAlbumDescription,
            tracks: $scope.addAlbumTracks == "" ? null : $scope.addAlbumTracks.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/album/",
            method: "POST",
            data: d
        }).then(response => {
            $scope.addAlbumTitle = "";
            $scope.addAlbumPublisher = "";
            $scope.addAlbumYear = "";
            $scope.addAlbumTracks = "";
            $scope.addAlbumDescription = "";
            $scope.refreshAlbums();
        });
    };
    $scope.loadAlbumTrack = (id) => {
        $http({
            url: "/api/album/" + id + "/",
            method: "GET"
        }).then((response) => {
            let a = $scope.albums.first(a => a.id == id);
            a.tracks = [];
            response.data.tracks.forEach(tid => {
                $http({ url: "/api/music/" + tid + "/", method: "GET" }).then((response) => {
                    let singers = [];
                    response.data.artist.forEach(sid => {
                        $http({ url: "/api/artist/" + sid + "/", method: "Get" }).then(response => singers.push(response.data.name));
                    });
                    response.data.artist = singers;
                    a.tracks.push(response.data);

                });
            });
            $scope.viewTracksAlbum = a;
        });
    };
}]);

angular.module('mm-app').controller('UserManageController', ['$http', '$scope', ($http, $scope) => {
    //Refresh User sections
    $scope.users = [];
    $scope.refreshUser = () => {
        $http({
            url: "/api/user/",
            method: "GET"
        }).then(response => {
            $scope.users = response.data;
        });
    };
    //Add user sections
    $scope.addUserName = "";
    $scope.addUserPass = "";
    $scope.addUserEmail = "";
    $scope.addUserFirstname = "";
    $scope.addUserLastname = "";
    $scope.addUserIsAdminRaw = "false";
    $scope.addUser = () => {
        let d = {
            username: $scope.addUserName,
            password: $scope.addUserPass,
            email: $scope.addUserEmail,
            first_name: $scope.addUserFirstname,
            last_name: $scope.addUserLastname,
            is_admin: $scope.addUserIsAdminRaw == "true" ? true : false
        };
        $http({
            method: "POST",
            url: "/api/user/",
            data: d
        }).then(response => {
            $scope.addUserName = "";
            $scope.addUserPass = "";
            $scope.addUserEmail = "";
            $scope.addUserFirstname = "";
            $scope.addUserLastname = "";
            $scope.addUserIsAdminRaw = "false";
            $scope.refreshUser();
        });

    };
    //Edit user sections
    $scope.editUser = null;
    $scope.toEditUser = (id) => {
        $http({ url: "/api/user/" + id + "/", method: "GET" }).then(response => {
            $scope.editUser = response.data;
            $scope.editUser.isAdminRaw = $scope.editUser.is_staff == true ? "true" : "false";
            $scope.editUser.isActiveRaw = $scope.editUser.is_active == true ? "true" : "false";
        });
    };
    $scope.editUserDo = () => {
        let d = {
            email: $scope.editUser.email,
            first_name: $scope.editUser.first_name,
            last_name: $scope.editUser.last_name,
            is_admin: $scope.editUser.isAdminRaw = $scope.editUser.isAdminRaw == "true" ? true : false,
            is_active: $scope.editUser.isActiveRaw = $scope.editUser.isActiveRaw == "true" ? true : false
        };
        $http({
            url: "/api/user/" + $scope.editUser.id + "/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.editUser = null;
            $scope.refreshUser();
        });
    };
    //Edit password sections
    $scope.editPassId = "";
    $scope.editPassName = "";
    $scope.editPassNew = "";
    $scope.toEditPass = (id, name) => {
        $scope.editPassId = id;
        $scope.editPassName = name;
    };
    $scope.editPass = () => {
        let d = {
            new_password: $scope.editPassNew
        };
        $http({
            url: "/api/user/" + $scope.editPassId + "/password/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.editPassId = "";
            $scope.editPassName = "";
            $scope.editPassNew = "";
            $scope.refreshUser();
        });
    };
}]);

angular.module('mm-app').controller('PlaylistManageController', ['$http', '$scope', 'FileUploader', '$cookies', ($http, $scope, FileUploader, $cookies) => {
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
    $scope.refreshPlaylists = () => {
        $http({
            url: "/api/playlist/",
            method: "GET"
        }).then(response => {
            $scope.playlists = response.data;
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
            $scope.refreshPlaylists();
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
        });
    };
    $scope.editPlaylist = () => {
        let d = {
            name: $scope.editingPlaylist.name,
            description: $scope.editingPlaylist.description,
            play_count: $scope.editingPlaylist.play_count,
            owner: $scope.editingPlaylist.owner,
            songs: $scope.editingPlaylist.songs == "" ? [] : $scope.editingPlaylist.rawSongs.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/playlist/" + $scope.editingPlaylist.id + "/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.editingPlaylist = null;
            $scope.refreshPlaylists();
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
            $scope.refreshPlaylists();
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
        });
    };
    $scope.setCollectorRemove = (id) => $scope.collectorRemoveUserId = id;
}]);