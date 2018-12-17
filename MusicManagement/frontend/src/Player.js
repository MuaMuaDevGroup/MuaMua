angular.module('mm-app')
.controller("yourController",function($scope,ngAudio){
    $scope.sound = ngAudio.load("sounds/mySound.mp3"); // returns NgAudioObject
})