var app = angular.module('myApp', []);
app.controller('welcomeCtrl', function($scope, $location,$http) {
    var numberFormat=['一','二','三','四','五','六','七','八','九'];
    var param = $location.search();
    $scope.token = param.token;
    // 默认加载
    $http({
        method: 'POST',
        url:host+"/hasan/common/guide",
        data:{}
    }).success(function(data) {
        $scope.guide = data.attach;
        console.log(data);
        $scope.guide.date = $scope.guide.lunaryear+"/"+$scope.guide.month+"/"+$scope.guide.day+"日";
        $scope.jieqi = $scope.guide.jieQiPassDay === 0?$scope.guide.jieqi:$scope.guide.nextJieQi;
        $scope.days = $scope.guide.jieQiPassDay === 0?"":$scope.parseNumber($scope.guide.nextJieQiDay)+"日后";
        $scope.jieqiG = $scope.guide.jieQiPassDay === 0?"":$scope.guide.jieqi+"已过";

        $scope.lunarmonth = $scope.guide.lunarmonth.substring(0,1)+" "+$scope.guide.lunarmonth.substring(1)
    });

    $scope.parseNumber = function (number) {
        var sw = parseInt(number/10);
        var ys = number%10;
        if(sw === 0)
            return numberFormat[ys-1];
        else if(sw === 1)
            return "十" + (ys===0?"":numberFormat[ys-1]);
        else
            return numberFormat[sw-1]+"十"+numberFormat[ys-1];
    };

    $http({
        method: 'POST',
        url:host+"/hasan/resource/list",
        data:{cfgIds:[1050]}
    }).success(function(data) {
        var img = data.attach.list[0].url;
        $(".welcomePage_").css("background-image","url("+img+")");
    });

});
