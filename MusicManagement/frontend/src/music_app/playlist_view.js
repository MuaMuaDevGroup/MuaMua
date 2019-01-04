import 'angular'
import 'linqjs'
angular.module('mm-app').controller("PlayListViewController", ["$http", "$scope", "mmMusic", "mainPageComm", "FileUploader", "$cookies", ($http, $scope, mmMusic, mmComm, FileUploader, $cookies) => {
    $scope.nowView = 'playlist';
    // Set Handler When Other Controller notify this ctrl
    mmComm.setPlaylistViewCtrlSetDisplayerHandler((albumOrPlaylistId, displayName) => {
        $scope.nowView = displayName;
        if (displayName == 'playlist')
            $http({
                url: "/api/playlist/" + albumOrPlaylistId + "/",
                method: "GET"
            }).then(response => {
                $scope.playlist = response.data;
                $scope.loadPlaylistDetail($scope.playlist);
            });
        else
            $http({
                url: "/api/album/" + albumOrPlaylistId + "/",
                method: "GET"
            }).then(response => {
                $scope.album = response.data;
                $scope.loadAlbumDetail($scope.album);
            });
    });
    // Get Login State Sections
    $scope.loginState = () => mmComm.getLoginState();
    // Collect Playlist
    $scope.collectPlaylist = playlist => {
        let d = {
            playlist: playlist.id
        };
        $http({
            url: "/api/playlist/my/collection/",
            method: "POST",
            data: d
        }).then(response => {
            playlist.isCollected = true;
        });
    }
    $scope.uncollectPlaylist = playlist => {
        $http({
            url: "/api/playlist/my/collection/" + playlist.id + "/",
            method: "DELETE"
        }).then(response => {
            playlist.isCollected = false;
        });
    };
    $scope.isPlaylistCollected = false;
    // Add to Playlist Sections
    $scope.sendToPlay = music => {
        mmMusic.setMusicPlaying(music);
    };
    $scope.selectedMusic = null;
    $scope.toSetSelectedMusic = (music) => $scope.selectedMusic = music;
    $scope.selectedPlaylistId = null;
    $scope.availablePlaylists = [];
    $scope.getPlaylists = () => {
        $http({
            url: "/api/playlist/my/",
            method: "GET"
        }).then(response => {
            $scope.availablePlaylists = response.data;
        })
    };
    $scope.addToPlaylist = (music, playlistid) => {
        $http({
            url: "/api/playlist/my/" + playlistid + "/",
            method: "GET"
        }).then(response => {
            let data = {
                name: response.data.name,
                description: response.data.description,
                songs: response.data.songs
            }
            data.songs.push(music.id);
            $http({
                url: "/api/playlist/my/" + playlistid + "/",
                method: "PUT",
                data: data
            })
        });
    }

    // Edit Playlist Sections
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
    $scope.editingPlaylist = null;
    $scope.toEditPlaylist = playlist => {
        $scope.editingPlaylist = playlist;
        $scope.nowUploader.url = "/api/playlist/my/" + playlist.id + "/cover/";
        $scope.nowUploader.headers = { 'X-CSRFToken': $cookies.get("csrftoken") };
    };
    $scope.editPlaylist = (playlist) => {
        $http({
            url: "/api/playlist/my/" + playlist.id + "/",
            method: "PUT",
            data: playlist
        }).then(response => {
            $scope.nowUploader.uploadAll();
            mmComm.sidebarPlaylistRefresh();
        });
    };
    // Delete Playlist Sections
    $scope.deletingPlaylist = null;
    $scope.toDeletePlaylist = playlist => {
        $scope.deletingPlaylist = playlist;
    };
    $scope.deletePlaylist = playlist => {
        $http({
            url: "/api/playlist/my/" + playlist.id + "/",
            method: "DELETE"
        }).then(response => {
            mmComm.sidebarPlaylistRefresh();
        });
    };
    // Album Sections
    $scope.album = null;
    $scope.loadAlbumDetail = album => {
        // Load Tracks Detail
        let m = $scope.loadMusic(album.tracks);
        album.trackEntities = m.tracks;
        album.artistNames = m.artists.select(a => a.name);
    };
    // Playlist Sections
    $scope.playlist = null;
    $scope.loadPlaylistDetail = playlist => {
        // Load Songs Detail
        let m = $scope.loadMusic(playlist.songs);
        playlist.songEntities = m.tracks;
        playlist.artistNames = m.artists.select(a => a.name);
        // Check if Playlist belongs to user
        $http({
            url: "/api/playlist/my/" + playlist.id + "/",
            method: "GET"
        }).then(response => playlist.isOwner = true, response => playlist.isOwner = false);
        // Check if collects
        $http({
            url: "/api/playlist/my/collection/" + playlist.id + "/",
            method: "GET"
        }).then(response => playlist.isCollected = true, response => playlist.isCollected = false);

    };
    // Common Sections
    $scope.loadArtist = (artistIds, nowArtistNames) => {
        let rtnArtistNames = [];
        artistIds.forEach(t => {
            if (!nowArtistNames.first(l => l.id == t)) {
                $http({ url: "/api/artist/" + t + "/" }).then(response => {
                    let a = {
                        id: response.data.id,
                        name: response.data.name
                    }
                    nowArtistNames.push(a);
                    rtnArtistNames.push(a);
                });
            }
        });
        return rtnArtistNames;
    };

    $scope.loadMusic = (musicIds) => {
        let trackEntities = [];
        let nowArtistNames = [];
        musicIds.forEach(a => {
            $http({
                url: "/api/music/" + a + "/",
                method: "GET"
            }).then(response => {
                let m = $scope.loadArtist(response.data.artist, nowArtistNames);
                response.data.artists = m;
                // Load Album Title
                if (response.data.album != null)
                    $http({ url: "/api/album/" + response.data.album + "/", method: "GET" }).then(response2 => { response.data.albumTitle = response2.data.title; });
                trackEntities.push(response.data);
            });
        });
        return {
            tracks: trackEntities,
            artists: nowArtistNames
        };
    };
}]);