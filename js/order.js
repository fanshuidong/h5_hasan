var app = angular.module('myApp', ['ionic']);
app.controller('orderCtrl', function($scope, $location,$http,$timeout) {
    var param = $location.search();



    $scope.page=1;
    $scope.pageSize=10;
    $scope.orders = [];
    $scope.tipShow=false;
    $scope.bottomTip=false;
    $scope.hasInfinite = true;


    // 默认加载
    $http({
        method: 'POST',
        url:"http://121.196.193.96/hasan/order/list",
        headers:{'token':param.token},
        data:{uid:param.uid,page:$scope.page,pageSize:$scope.pageSize}
    }).success(function(data) {
        if(data.attach.list.length>0){
            $scope.orders = data.attach.list;
        }else{
            $scope.tipShow=true;
        }
    });

    $scope.orders =[{},{},{}];

    // 下拉刷新
    $scope.doRefresh = function() {
        $scope.orders = [];
        $scope.page = 1;
        $timeout(function () {//和下拉动画配合时间
            $http({
                method: 'POST',
                url:"http://121.196.193.96/hasan/order/list",
                headers:{'token':param.token},
                data:{uid:param.uid,page:$scope.page,pageSize:$scope.pageSize}
            }).success(function(data) {
                if(data.attach.list&&data.attach.list.length>0){
                    $scope.tipShow=false;
                    for(var i = 0 ; i < data.attach.list.length ; i++){
                        $scope.orders.push(data.attach.list[i]);
                    }
                }else{
                    $scope.tipShow=true;
                }
            });
            $scope.$broadcast('scroll.refreshComplete');
        },888);
    };


    // 下拉加载
    $scope.loadMoreData = function() {
        $scope.page++;
        $http({
            method: 'POST',
            url:"http://121.196.193.96/hasan/order/list",
            headers:{'token':param.token},
            data:{uid:param.uid,page:$scope.page,pageSize:$scope.pageSize}
        }).success(function(data) {
            //本次请求有数据
            if (data.attach.list&&data.attach.list.length > 0) {
                for(var i = 0 ; i < data.attach.list.length ; i++){
                    $scope.orders.push(data.attach.list[i]);
                }
                $scope.hasInfinite =true;
                $scope.bottomTip=false;
            } else {//本次请求没有数据
                $scope.hasInfinite = false;
                $scope.bottomTip=true;
            }
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };


    // 设置页面高度
    document.querySelector(".order").style.height=document.documentElement.clientHeight+'px';
});
