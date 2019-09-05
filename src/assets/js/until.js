export default{
    //排序
    compare(property,val) {
        return function(a, b) {
          const value1 = a[property];
          const value2 = b[property];
          if(val ==1){
            return value1 - value2;
          }else if(val ==2){
            return value2 - value1;
          }
        };
      },
      //时间格式转换
    changDage(value) {
        if (value) {
            if(typeof(value)=='object'){
                    let _value =
                    value.getFullYear() +
                    "-" +
                    (value.getMonth() + 1) +
                    "-" +
                    value.getDate() +
                    " " +
                    value.getHours() +
                    ":" +
                    value.getMinutes() +
                    ":" +
                    value.getSeconds();
                    return _value;
                }
            }else if(value.indexOf("-") != -1 || value.indexOf("/") != -1 || value.indexOf(":") != -1){
                return value;
            }else{
              return value;
            }
          
      }
}