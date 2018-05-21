var app = angular.module('myApp', []);
app.controller('orderCtrl', function($scope, $location,$http) {
    var param = $location.search();
    $http({
        method: 'POST',
        url:"http://121.196.193.96/hasan/order/list",
        headers:{'token':param.token},
        data:{uid:param.uid}
    }).success(function(data) {
        console.log(data);
        $scope.orders = data.attach.list
    });
});
