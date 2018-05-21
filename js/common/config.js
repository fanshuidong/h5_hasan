app.factory('httpInterceptor',['$q','$location','$rootScope',function ($q,$location,$rootScope){
    return{
        request:function(config) {
            config.headers = config.headers || {};
            config.headers.token = $location.search().token;
            return config;
        },
        requestError:function(config){
            return $q.reject(config);
        },
        response : function(response){
            return response;
        },
        responseError : function(response) {
            return $q.reject(response);
        }
    }
}]);

app.config(['$httpProvider',function ($httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
    $httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.defaults.transformRequest = [function(data) {
        return String(data) !== '[object File]'
            ? JSON.stringify(data)
            : data;
    }];
}]);