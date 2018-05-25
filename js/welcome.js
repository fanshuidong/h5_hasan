var app = angular.module('myApp', []);
app.controller('welcomeCtrl', function($scope, $location,$http) {
    var param = $location.search();
    $scope.token = param.token;
    // 默认加载
    $http({
        method: 'POST',
        url:"http://121.196.193.96/hasan/common/guide",
        // url:"http://localhost:8089/hasan/common/guide",
        data:{}
    }).success(function(data) {
        $scope.guide = data.attach;
        console.log(data);
        var hour = $scope.guide.hour;
        $scope.guide.date = $scope.guide.lunaryear+"-"+$scope.guide.month+"-"+$scope.guide.day;
        $scope.guide.date = $scope.guide.lunaryear+"-"+$scope.guide.month+"-"+$scope.guide.day;
        $scope.guide.week = "星期"+$scope.guide.week;
        $scope.guide.gz = $scope.guide.lunarmonth+$scope.guide.lunarday+$scope.guide.suici[0]+
            "【"+$scope.guide.shengxiao+"年】"+" "+$scope.guide.suici[1]+" "+$scope.guide.suici[2];
        // $scope.guide.jieqi = "小满";
        if(!$scope.guide.jieqi){
            if (hour >= 15 && hour < 19){
                $scope.guide.greetingC = "下午好";
                $scope.guide.greetingE = "Good afternoon";
            }if (hour >= 11 && hour < 15){
                $scope.guide.greetingC = "中午好";
                $scope.guide.greetingE = "Good afternoon";
            }if (hour >= 19 && hour < 22) {
                $scope.guide.greetingC = "晚上好";
                $scope.guide.greetingE = "Good evening";
            }if (hour >= 22 && hour <= 24 || hour >= 0 && hour < 6) {
                $scope.guide.greetingC = "深夜好";
                $scope.guide.greetingE = "Good night";
            }if (hour >= 6 && hour < 11) {
                $scope.guide.greetingC = "早上好";
                $scope.guide.greetingE = "Good morning";
            }
        }else{
            $scope.guide.greetingC = $scope.guide.jieqi;
            $scope.guide.greetingE="";
        }
    });

});
