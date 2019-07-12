module.exports = {
  decNum: function (a){/*获取小数位数*/
    var r=0;
    a=a.toString();
    if(a.indexOf(".")!== -1) r=a.split(".")[1].length;
    return r;
  },
  int: function (a){/*去除小数点并转成数值*/
    return parseInt(a.toString().replace(".",""));
  },
  /*
		* 核心方法，实现加减乘除运算，确保不丢失精度
		* 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
		*
		* @param a {number} 运算数1
		* @param b {number} 运算数2
		* @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
		* @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
		*
		*/
  calc: function (a,b,type){//加减乘除
    var r,
        da=this.decNum(a),
        db=this.decNum(b),
        dsum=da+db,
        dmin=Math.min(da,db),
        dmax=Math.max(da,db);
    dsum+=dmax-dmin;
    dsum=Math.pow(10,dsum);
    dmax=Math.pow(10,dmax);
    a=this.int(a);
    b=this.int(b);
    if(da>db){
      b*=Math.pow(10,da-db);
    }else{
      a*=Math.pow(10,db-da);
    }
    switch(type){
      case "add":
        r=(a+b)/dmax;
        break;
      case "subtract":
        r=(a-b)/dmax;
        break;
      case "multiply":
        r=(a*b)/dsum;
        break;
      case "divide":
        r=a/b;
        break;
    }
    return r;
  },

  add: function(a,b){
    let result = this.calc(a,b,'add');
    return result;
  }
}