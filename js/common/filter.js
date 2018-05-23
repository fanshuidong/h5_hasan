//日期转化服务
app.service("DateUtil",function () {
    this.yyyy$MM$dd				= "yyyy/MM/dd";
    this.yyyyMMdd				= "yyyyMMdd";
    this.yyyy_MM_dd				= "yyyy-MM-dd";
    this.yyyyMMMddHHmmss		= "yyyyMMddHHmmss";
    this.YYYY_MM_DD_HH_MM_SS	= "yyyy-MM-dd HH:mm:ss";
    this.HHmmss					= "HHmmss";
    this.HH_mm_ss				= "HH:mm:ss";
    this.getFormateDate = function (date,format) {
        this.year=date.getFullYear();
        this.month=(date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
        this.date=date.getDate()<10?"0"+date.getDate():date.getDate();
        this.hour=date.getHours()<10?"0"+date.getHours():date.getHours();
        this.minute=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        this.second=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
        switch (format){
            case this.yyyyMMdd:
                return this.year+""+this.month+""+this.date;
            default:
                return this.year+"-"+this.month+"-"+this.date+"   "+this.hour+":"+this.minute+":"+this.second;
        }
    };
});

//定义枚举实体
app.service('enums',function () {
    this.orderState = [
        {value:"INIT",text:"待支付",mark:1},
        {value:"PAYING",text:"支付中",mark:2},
        {value:"PAID",text:"待发货",mark:3},
        {value:"DELIVERED",text:"待收货",mark:4},
        {value:"RECEIVED",text:"待评价",mark:5},
        {value:"FINISH",text:"已完成",mark:6}
    ];

    this.enumConfig = {
        orderState:this.orderState
    };
    this.getEntity = function (entity,value) {
        for(var index in entity){
            if(value == entity[index].mark || value==entity[index].value){
                return entity[index];
            }
        }
        return null;
    };
});

//枚举对象通用过滤器
app.filter("enumFilter",function (enums,$sce) {
    return function (value,name) {//value为需要被过滤的值,name表示枚举对象名
        var entity = enums.enumConfig[name];
        for(var index in entity){
            if(value == entity[index].mark || value==entity[index].value || value==entity[index].id){
                if(entity[index].color){
                    return $sce.trustAsHtml("<span style='color: "+entity[index].color+"'>"+entity[index].text+"</span>");
                }else{
                    return entity[index].name?entity[index].name:entity[index].text;
                }
            }
        }
        return value;
    }
});

//时间过滤展示
app.filter("timeFilter",function(DateUtil){
    return function(str){
        var out=str;
        if(str==0 || str==null){
            out="/"
        }else{
            out=DateUtil.getFormateDate(new Date(str*1000));
        }
        return out;
    }
});

app.filter("minutesFilter",function () {//分钟转日分秒格式
    return function(minutes){
        var h = parseInt(minutes/60);
        var m = minutes%60;
        return (h<10?("0"+h):h)+":"+(m<10?("0"+m):m)+":00";
    }
});
