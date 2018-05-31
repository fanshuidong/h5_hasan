var app = angular.module('myApp', []);
app.controller('orderCtrl', function($scope, $location,$http) {
    var param = $location.search();
    $scope.token = param.token;
    // 默认加载
    $http({
        method: 'POST',
        url:host+"/hasan/order/detail",
        headers:{'token':$scope.token},
        data:{id:param.id}
    }).success(function(data) {
        $scope.order = data.attach;
        if(Number($scope.order.expressFee)===0)
            $scope.expressInfo = "（包邮）";
        else
            $scope.expressInfo = "（含快递费："+Number($scope.order.expressFee)+"）";
        console.log(data);
    });

    //确认收货
    $scope.receive = function () {
        $http({
            method: 'POST',
            url:host+"/hasan/order/receive",
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
