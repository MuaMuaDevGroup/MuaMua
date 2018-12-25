import 'angular'
import 'linqjs'
angular.module('mm-app').controller("PlayListViewController", ["$http", "$scope", "mmMusic", "mainPageComm", ($http, $scope, mmMusic, mmComm) => {
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