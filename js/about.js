var app = angular.module('myApp', []);
app.controller('aboutCtrl', function($scope, $location,$http,$timeout) {
    var param = $location.search();
    $scope.versionName = param.versionName;
});

