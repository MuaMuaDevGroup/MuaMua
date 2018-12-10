import 'angular'
import 'linqjs'
angular.module('mm-app').controller('MusicManageController', ['$http', '$scope', ($http, $scope) => {
    $scope.musics=[];
    $scope.refreshMusic=()=>{
        $http({
            method:"GET",
            url:"/api/music"
        }).then((response) => {
            $scope.musics=response.data;
            console.log($scope.musics);
            $scope.$apply();
        });
    };
    $scope.addStyle="";
    $scope.addDuration="";
    $scope.addMusicTitle="";
    $scope.addMusicArtist="";
    $scope.addMusicAlbum="";
    $scope.addMusic=()=>{
        let d={
            Id:$scope.addMusicId,
            Sytle:$scope.addStyle,
            Duration:$scope.addDuration,
            Title=$scope.addMusicTitle,
            Artist=$scope.addMusicArtist,
            Album=$scope.addMusicAlbum
        }
        $http({
            method: "POST",
            url: "/api/music/",
            data: d
        }).then((response) => {
            $scope.addMusicId="";
            $scope.addStyle="";
            $scope.addDuration="";
            $scope.addMusicTitle="";
            $scope.addMusicArtist="";
            $scope.addMusicAlbum="";
            $scope.refreshMusic();
        });
    };
    $scope.editMusicId=null;
    $scope.editMusicStyle="";
    $scope.editMusicDuration="";
    $scope.editMusicTitle="";
    $scope.editMusicArtist="";
    $scope.editMusicAlbum="";

    $scope.toEditMusic = (id, style, duration, title, artist, album) => {
        $scope.editMusicId = id;
        $scope.editMusicStyle = style;
        $scope.editMusicDuration = duration;
        $scope.editMusicTitle = title;
        $scope.editMusicArtist=artist;
        $scope.editMusicAlbum=album;
    };
    $scope.editMusic = () => {
        let u = "/api/music/" + $scope.editMuiscId + "/";
        let d={
            Id:$scope.editMusicId,
            Sytle:$scope.editStyle,
            Duration:$scope.editDuration,
            Title=$scope.editMusicTitle,
            Artist=$scope.editMusicArtist,
            Album=$scope.editMusicAlbum
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
            $scope.editMusicArtist = "";
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
            country: $scope.addArtistCountrye,
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