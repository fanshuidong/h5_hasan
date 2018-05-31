var app = angular.module('myApp', []);
app.controller('goodsCtrl', function($scope, $location,$http,$timeout) {
    var param = $location.search();
    $scope.cartNum = param.cartNum;
    $scope.token = param.token;
    $scope.goodsPrice = 0;
    $http({
        method: 'POST',
        // url:"http://localhost:8089/hasan/goods/detail",
        url: host+"/hasan/goods/detail",
        headers: {'token': param.token},
        data: {id: param.id}
    }).success(function (data) {
        console.log(data);
        $scope.goods = data.attach;
        //获取用户会员信息
        $http({
            method: 'POST',
            url: host+"/hasan/common/wallet",
            headers: {'token': param.token},
            data: {}
        }).success(function (data) {
            console.log(data);
            $scope.memberId = data.attach.memberId;
            for (var i in $scope.goods.prices) {
                if ($scope.goods.prices[i].memberId == $scope.memberId) {
                    $scope.goodsPrice = $scope.goods.prices[i].price;
                }
            }
        });
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

    $scope.goCart = function () {
        window.location.href = "hasanapp://app.hasan.web/cartListAction";
    };
    $scope.addCart = function () {
        var goodsList = {
            goodsId:$scope.goods.id,
            goodsName:$scope.goods.name,
            goodsImg:$scope.goods.resources['1000'][0].url,
            goodsPrice:$scope.goodsPrice,
            goodsNum:1
        };
        window.location.href = "hasanapp://app.hasan.web/addCartAction?goodsList="+JSON.stringify(goodsList);
        $scope.cartNum = Number($scope.cartNum)+1;
    };
    $scope.queryEvaluations = function () {
        window.location.href = "hasanapp://app.hasan.web/discussListAction?goodsId="+$scope.goods.id;
    };
    
    //点击商品滚动图放大
    $scope.lookPicture = function (index) {
        var imgArray=[];
        for(var i=0;i<$scope.goods.resources['1001'].length;i++)
            imgArray.push($scope.goods.resources['1001'][i].url);
        // alert("hasanapp://app.hasan.web/lookPictureAction?position="+index+"&imgArray="+JSON.stringify(imgArray));
        window.location.href = "hasanapp://app.hasan.web/lookPictureAction?position="+index+"&imgArray="+JSON.stringify(imgArray);
    }
});

// document.write("<script language='javascript' src='js/filter.js'></script>");
