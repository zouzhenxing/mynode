exports.tabtype = (type) => {
    if( type == 'ask' ) {
        return '问答';
    } else if( type == 'share' ) {
        return '分享';
    } else if( type == 'job' ) {
        return '工作';
    } else {
        return '&nbsp;';
    }
}

exports.timeago = (date)=> {
    //第一步，计算出时间相差
    var diff = new Date().getTime() - new Date(date).getTime();
    if( diff <= 1000 * 60 ) { //分钟
        return "刚刚";
    } else if( diff <= 1000 * 3600 ) { //小时
        return new Date(diff).getMinutes() + " minutes ago";
    } else if( diff <= 1000 * 3600 * 24 ) { //天
        return new Date(diff).getHours() + " hours ago";
    } else if( diff <= 1000 * 3600 * 24 * 31 ) { //月
        return new Date(diff).getDay() + "  day ago";
    } else if( diff <= 1000 * 3600 * 24 * 365 ) { //年
        return new Date(diff).getMonth() + " month ago";
    } else {
        return new Date(diff).getYear() + " year ago";
    }
}