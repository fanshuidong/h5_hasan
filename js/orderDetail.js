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
        //待支付状态订单价格重新计算
        if($scope.order.state === 'INIT') {
            var goodsEntity = {};
            for (var j = 0; j <$scope.order.goods.length; j++) {
                goodsEntity[$scope.order.goods[j].goodsId] = $scope.order.goods[j].goodsNum
            }
            $.ajax({
                type : "POST",
                async:false,
                url : host + "/hasan/order/pay/preview",
                data : JSON.stringify({goods: goodsEntity}),
                contentType : "application/json",
                dataType : "json",
                success:function(data) {
                    $scope.order.price = data.attach.expAmount?data.attach.expAmount:0
                    +data.attach.basicAmount?data.attach.basicAmount:0+data.attach.rechargeAmount?data.attach.rechargeAmount:0;
                    for (var i = 0; i <$scope.order.goods.length; i++) {
                        $scope.order.goods[i].unitPrice = data.attach.prices[$scope.order.goods[i].goodsId];
                    }
                    $scope.order.expressFee = data.attach.expressFee?data.attach.expressFee:0
                }
            });
        }
        if(Number($scope.order.expressFee)===0)
            $scope.expressInfo = "（包邮）";
        else
            $scope.expressInfo = "（含快递费："+Number($scope.order.expressFee)+"）";
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
