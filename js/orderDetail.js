var app = angular.module('myApp', []);
app.controller('orderCtrl', function($scope, $location,$http) {
    var param = $location.search();
    $scope.token = param.token;
    // 默认加载
    $http({
        method: 'POST',
        url:"http://121.196.193.96/hasan/order/detail",
        // url:"http://localhost:8089/hasan/order/detail",
        headers:{'token':$scope.token},
        data:{id:param.id}
    }).success(function(data) {
        $scope.order = data.attach;
        console.log(data);
    });

    //确认收货
    $scope.receive = function () {
        $http({
            method: 'POST',
            url:"http://121.196.193.96/hasan/order/receive",
            headers:{'token':$scope.token},
            data:{id:$scope.order.id}
        }).success(function(data) {
            if(data.code==='code.success')
                $scope.order.state = 'RECEIVED';
        });
    };

    //去评价
    $scope.goEvaluation = function () {
        var goodsList = [];
        for(var i = 0;i<$scope.order.goods.length;i++){
            var goods = {
                goodsId:$scope.order.goods[i].goodsId,
                goodsName:$scope.order.goods[i].goodsName,
                goodsImg:$scope.order.icons[$scope.order.goods[i].goodsId]
            };
            goodsList.push(goods);
        }
        console.log("hasanapp://app.hasan.web/addDiscussAction?goodsList="+JSON.stringify(goodsList));
        window.location.href = "hasanapp://app.hasan.web/addDiscussAction?goodsList="+JSON.stringify(goodsList);
    };
});
