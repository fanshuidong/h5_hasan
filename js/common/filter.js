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
