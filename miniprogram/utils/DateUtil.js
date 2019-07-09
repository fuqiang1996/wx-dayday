module.exports = {
  /**
   * 格式化日期函数
   * @param {string} dateStr
   * @param {string} formatter
   * 格式串，YYYY表示年度,MM表示月份,DD表示日期
   * 示例： YYYY-MM-DD（默认值）、YYYY年MM月
   * @param {object} option
   * @param {bool} option.isPadZero 是否填充0,默认为true
   * @returns {string}
   */
  formatDate: function (dateStr, formatter = 'YYYY-MM-DD hh:mm:ss', option = {
    isPadZero: true
  }) {
    if (!dateStr) {
      return null;
    }
    var date = new Date(dateStr);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (option.isPadZero) {
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (second < 10) {
        second = '0' + second;
      }
    }
    return formatter.replace('YYYY', year).replace('MM', month).replace('DD', day).replace('hh', hour).replace('mm', minute).replace('ss', second);
  },
  parseDate: function (dateStr) {
    if(typeof dateStr !== 'string'){
      return null;
    }

    var length = dateStr.length;
    if(length === 8){
      return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6, 8);
    }else if(length === 6){
      return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6);
    }else{
      return null;
    }

    
  },

  /**
   * 获取当前日期
   * 格式：yyyyMMdd
   */
  getCurDate: function() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let miu = date.getMinutes();
    let sec = date.getSeconds();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (miu < 10) {
      miu = '0' + miu;
    }
    if (sec < 10) {
      sec = '0' + sec;
    }
    return year +"-"+ month +"-"+ day +" "+ hour+":"+miu+":"+sec;
  },

  /**
   * 获取两个日期相差天数
   * dateStart：开始日期，格式：yyyyMMdd
   * dateEnd：终止日期，格式：yyyyMMdd
   */
  getDaysBetweenDate: function (dateStart, dateEnd) {
    const dateStartTime = dateStart.substring(0, 4) + '/' + dateStart.substring(4, 6) + '/' + dateStart.substring(6, 8);
    const dateEndTime = dateEnd.substring(0, 4) + '/' + dateEnd.substring(4, 6) + '/' + dateEnd.substring(6, 8);
    const date1 = new Date(dateStartTime);
    const date2 = new Date(dateEndTime);
    const days = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
    return days;
  }

}