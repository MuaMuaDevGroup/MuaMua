import 'angular'
import 'linqjs'
import 'angular-audio'
import 'angular-file-upload'

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

angular.module('mm-app').controller('ArtistManageController', ['$http', '$scope', 'FileUploader', '$cookies', 'djangoPage', ($http, $scope, FileUploader, $cookies, djangoPage) => {
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
            $scope.refreshArtist();
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
            $scope.refreshArtist();
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

angular.module('mm-app').controller('AlbumManageController', ['$http', '$scope', 'FileUploader', '$cookies', 'djangoPage', ($http, $scope, FileUploader, $cookies, djangoPage) => {
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
    $scope.pagination = new djangoPage("/api/album/");
    $scope.refreshAlbums = (url) => {
        $http({
            url: url,
            method: "GET"
        }).then(response => {
            $scope.albums = $scope.pagination.filterResult(response);
            $scope.albums.forEach(a => a.tracks = []);
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
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
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
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
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
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
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
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
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
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

angular.module('mm-app').controller('UserManageController', ['$http', '$scope', 'djangoPage', ($http, $scope, djangoPage) => {
    //Refresh User sections
    $scope.users = [];
    $scope.pagination = new djangoPage("/api/user/")
    $scope.refreshUser = (url) => {
        $http({
            url: url,
            method: "GET"
        }).then(response => {
            $scope.users = $scope.pagination.filterResult(response);
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
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });

    };
    //Edit user sections
    $scope.editUser = null;
    $scope.toEditUser = (id) => {
        $http({ url: "/api/user/" + id + "/", method: "GET" }).then(response => {
            $scope.editUser = response.data;
            $scope.editUser.isAdminRaw = $scope.editUser.is_staff == true ? "true" : "false";
            $scope.editUser.isActiveRaw = $scope.editUser.is_active == true ? "true" : "false";
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
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
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
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
        },
            response => {
                mmNotify.notify(response.status, response.statusText);
            });
    };
}]);

angular.module('mm-app').controller('PlaylistManageController', ['$http', '$scope', 'FileUploader', '$cookies', 'djangoPage', ($http, $scope, FileUploader, $cookies, djangoPage) => {
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
            $scope.refreshPlaylists();
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
            songs: $scope.editingPlaylist.songs == "" ? [] : $scope.editingPlaylist.rawSongs.split(",").select(t => parseInt(t))
        };
        $http({
            url: "/api/playlist/" + $scope.editingPlaylist.id + "/",
            method: "PUT",
            data: d
        }).then(response => {
            $scope.editingPlaylist = null;
            $scope.refreshPlaylists();
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
            $scope.refreshPlaylists();
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