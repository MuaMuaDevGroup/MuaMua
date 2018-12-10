import 'angular'
import 'linqjs'
angular.module('mm-app').controller('MusicManageController', ['$http', '$scope', ($http, $scope) => {
    $scope.musics = [];
    $scope.refreshMusic = () => {
        $http({
            method: "GET",
            url: "/api/music"
        }).then((response) => {
            $scope.musics = response.data;
            $scope.musics.forEach(m => {
                m.artistNames = [];
                m.artist.forEach(a => {
                    $http({ method: "GET", url: "/api/artist/" + a + "/" }).then((response) => { m.artistNames.push(response.data.name); });
                });
                if (m.album != null)
                    $http({ method: "GET", url: "/api/album/" + m.album + "/" }).then(response => m.AlbumName = response.data.title);
            });
            $scope.$apply();
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
        console.log(m);
        $scope.editMusicId = m.id;
        $scope.editMusicStyle = m.style;
        $scope.editMusicDuration = m.duration;
        $scope.editMusicTitle = m.title;
        $scope.editMusicRawArtists = m.artist.join(",");
        $scope.editMusicAlbum = m.album;
    };
    $scope.editMusic = () => {
        let u = "/api/music/" + $scope.editMusicId + "/";
        console.log($scope.editMusicRawArtists);
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

angular.module('mm-app').controller('ArtistManageController', ['$http', '$scope', ($http, $scope) => {
    $scope.artists = [];
    $scope.refreshArtist = () => {
        $http({
            method: "GET",
            url: "/api/artist/"
        }).then((response) => {
            $scope.artists = response.data;
            console.log($scope.artists);
            $scope.$apply();
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

angular.module('mm-app').controller('AlbumManageController', ['$http', '$scope', ($http, $scope) => {

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

    $scope.users = [];
    //Refresh User sections
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
    
}]);