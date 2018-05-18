var app = angular.module('myApp', []);
app.controller('cookbookCtrl', function($scope, $location,$http) {
    var param = $location.search();
    $scope.resources = [];//菜谱轮播图
    $http({
        method: 'POST',
        url:"http://121.196.193.96/hasan/cookbook/detail",
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
    })
});