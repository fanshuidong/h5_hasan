var app = angular.module('myApp', []);
app.controller('goodsCtrl', function($scope, $location,$http) {
    var param = $location.search();
    $http({
        method: 'POST',
        // url:"http://localhost:8089/hasan/goods/detail",
        url:"http://121.196.193.96/hasan/goods/detail",
        data:{id:param.id}
    }).success(function(data) {
        console.log(data);
        $scope.goods = data.attach;
    });
    var mySwiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination'
        },
        autoplay: {
            delay: 1000,//1秒切换一次
            disableOnInteraction: false
        },
        loop : true,
        speed:1000
    });

    $scope.goCart = function () {
        window.location.href = "hasanapp://app.hasan.web/cartListAction";
    };
    $scope.addCart = function () {
        var goodsList = {
            goodsId:$scope.goods.id,
            goodsName:$scope.goods.name,
            goodsImg:$scope.goods.resources['1000'][0].url,
            goodsPrice:$scope.goods.prices[0].price,
            goodsNum:1
        };
        window.location.href = "hasanapp://app.hasan.web/addCartAction?goodsList="+JSON.stringify(goodsList);
    }
});
// document.write("<script language='javascript' src='js/filter.js'></script>");
