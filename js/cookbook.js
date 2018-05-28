var app = angular.module('myApp', []);
app.controller('cookbookCtrl', function($scope, $location,$http,$timeout) {
    var param = $location.search();
    $scope.cartNum = param.cartNum;
    $scope.token = param.token;
    $scope.goodsId = param.goodsId;
    $scope.resources = [];//菜谱轮播图
    $http({
        method: 'POST',
        url:host+"/hasan/cookbook/detail",
        headers:{'token':param.token},
        data:{id:param.id}
    }).success(function(data) {
        console.log(data);
        $scope.cookbook = data.attach;
        for(var i = 0 ;i<$scope.cookbook.images.length;i++){
            if($scope.cookbook.images[i].cfgId==1011){
                $scope.resources.push($scope.cookbook.images[i])
            }
        }
    });


    $timeout(function () {
        var mySwiper = new Swiper('.swiper-container', {
            pagination: {
                el: '.swiper-pagination'
            },
            autoplay: {
                disableOnInteraction: false
            },
            loop:true,
            speed:1000
        });
    },800);

    //获取用户会员信息
    $http({
        method: 'POST',
        url:host+"/hasan/common/wallet",
        headers:{'token':param.token},
        data:{}
    }).success(function(data) {
        console.log(data);
        $scope.memberId = data.attach.memberId;
    });

    $scope.goCart = function () {
        window.location.href = "hasanapp://app.hasan.web/cartListAction";
    };
    $scope.addCart = function (item) {
        $http({
            method: 'POST',
            url:host+"/hasan/goods/detail",
            headers:{'token':param.token},
            data:{id:item.id}
        }).success(function(data) {
            console.log(data);
            if(data.code==='code.success'){
                $scope.goodsPrice = 0;
                for(var i in data.attach.prices){
                    if(data.attach.prices[i].memberId == $scope.memberId){
                        $scope.goodsPrice = data.attach.prices[i].price;
                    }
                }
                var goodsList = {
                    goodsId:data.attach.id,
                    goodsName:data.attach.name,
                    goodsImg:data.attach.resources['1000'][0].url,
                    goodsPrice:$scope.goodsPrice,
                    goodsNum:1
                };
                window.location.href = "hasanapp://app.hasan.web/addCartAction?goodsList="+JSON.stringify(goodsList);
                $scope.cartNum = Number($scope.cartNum)+1;
            }
        });
    }
});