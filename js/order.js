var app = angular.module('myApp', ['ionic']);
app.controller('orderCtrl', function($scope, $location,$http,$timeout) {
    var param = $location.search();
    $scope.token = param.token;
    $scope.page=1;
    $scope.pageSize=10;
    $scope.orders = [];
    $scope.topTip = false;
    $scope.bottomTip=false;
    $scope.hasInfinite = true;
    // 默认加载
    $http({
        method: 'POST',
        url:host+"/hasan/order/list",
        headers:{'token':$scope.token},
        data:{page:$scope.page,pageSize:$scope.pageSize}
    }).success(function(data) {
        console.log(data);
        $scope.orders = data.attach.list;
        if($scope.orders.length === 0)
            $scope.topTip = true;
        $scope.preview($scope.orders);
    });

    //待支付状态订单价格重新计算
    $scope.preview = function(orders){
        for(var i =0 ;i<orders.length;i++){//待支付状态的订单还需要去后台计算一次价格
            if(orders[i].state === 'INIT') {
                var goodsEntity = {};
                for (var j = 0; j <orders[i].goods.length; j++) {
                    goodsEntity[orders[i].goods[j].goodsId] = orders[i].goods[j].goodsNum
                }
                $.ajax({
                    type : "POST",
                    async:false,
                    url : host + "/hasan/order/pay/preview",
                    data : JSON.stringify({goods: goodsEntity}),
                    contentType : "application/json",
                    dataType : "json",
                    success:function(data) {
                        orders[i].price = data.attach.expAmount?data.attach.expAmount:0
                        +data.attach.basicAmount?data.attach.basicAmount:0+data.attach.rechargeAmount?data.attach.rechargeAmount:0;
                    }
                });
            }
        }
    };

    // 下拉刷新
    $scope.doRefresh = function() {
        $scope.orders = [];
        $scope.page = 1;
        var data = {page:$scope.page,pageSize:$scope.pageSize};
        if($scope.state)
            data.state = $scope.state;
        $timeout(function () {//和下拉动画配合时间
            $http({
                method: 'POST',
                url:host+"/hasan/order/list",
                headers:{'token':$scope.token},
                data:data
            }).success(function(data) {
                console.log(data);
                $scope.orders = data.attach.list;
                if($scope.orders.length === 0)
                    $scope.topTip = true;
                $scope.bottomTip=false;
                $scope.hasInfinite = true;
                $scope.preview($scope.orders);
            });
            $scope.$broadcast('scroll.refreshComplete');
        },888);
    };

    // 下拉加载
    $scope.loadMoreData = function() {
        $scope.hasInfinite = false;
        $scope.page++;
        var data = {page:$scope.page,pageSize:$scope.pageSize};
        if($scope.state)
            data.state = $scope.state;
        $timeout(function () {//和下拉动画配合时间
        $http({
            method: 'POST',
            url:host+"/hasan/order/list",
            headers:{'token':$scope.token},
            data:data
        }).success(function(data) {
            //本次请求有数据
            if (data.attach.list&&data.attach.list.length > 0) {
                for(var i = 0 ; i < data.attach.list.length ; i++){
                    $scope.orders.push(data.attach.list[i]);
                }
                $scope.preview($scope.orders);
                $scope.hasInfinite =true;
                $scope.bottomTip=false;
            } else {//本次请求没有数据
                $scope.hasInfinite = false;
                $scope.bottomTip=true;
            }
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
        },888);
    };

    $(".heng-around li").click(function () {
        $(".heng-around .active").removeClass("active");
        $(this).addClass("active");
        $scope.page=1;
        $scope.topTip = false;
        var data = {page:$scope.page,pageSize:$scope.pageSize};
        if(this.id!='ALL'){
            data.state = this.id;
            $scope.state = this.id;
        }else{
            $scope.state = undefined;
        }
        $http({
            method: 'POST',
            url:host+"/hasan/order/list",
            headers:{'token':$scope.token},
            data:data
        }).success(function(data) {
            console.log(data);
            $scope.orders = data.attach.list;
            if($scope.orders.length === 0)
                $scope.topTip = true
            $scope.preview($scope.orders);
        });
    });
    //去评价
    $scope.goEvaluation = function (item) {
        var goodsList = [];
        $http({
            method: 'POST',
            url:host+"/hasan/order/detail",
            headers:{'token':$scope.token},
            data:{id:item.id}
        }).success(function(data) {
            $scope.order = data.attach;
            console.log(data);
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
        });
    };

    //确认收货
    $scope.receive = function (item) {
        $http({
            method: 'POST',
            url:host+"/hasan/order/receive",
            headers:{'token':$scope.token},
            data:{id:item.id}
        }).success(function(data) {
            if(data.code==='code.success')
                item.state = 'RECEIVED';
        });
    };

    $scope.gotoOrderDetails = function (id) {
        window.location.href = "orderDetails.html#?id="+id+"&token="+$scope.token;
    };

    // 设置页面高度
    document.querySelector(".order").style.height=document.documentElement.clientHeight+'px';
});
