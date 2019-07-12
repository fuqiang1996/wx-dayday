const DbUtils = require('../../utils/DbUtils');
const DateUtil = require('../../utils/DateUtil');
const NumberHandle = require('../../utils/NumberHandle');
import F2 from '../../f2-canvas/lib/f2';

let chart = null;
let map = null;
let data = null;
function initChart(canvas, width, height) { // 使用 F2 绘制图表
                                                     // let map = {
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data, {
    percent: {
      formatter(val) {
        return val * 100 + '%';
      }
    }
  });
  chart.legend({
    position: 'right',
    itemFormatter(val) {
      return val + '  ' + map[val];
    }
  });
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    radius: 0.85
  });
  chart.axis(false);
  chart.interval()
      .position('a*percent')
      .color('name', ['#1890FF', '#13C2C2', '#c22f27', '#FACC14', '#F04864', '#8543E0','#B1A5FA','#71C269','#5CECFF'])
      .adjust('stack')
      .style({
        lineWidth: 1,
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
      })
      .animate({
        appear: {
          duration: 1200,
          easing: 'bounceOut'
        }
      });
  chart.render();
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      onInit: initChart
    },
    date: '',
    consume: [],
    map: {},
    data: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryMonthData();

    map = {
        '餐饮美食': 40+"%",
        '服饰美容': 10+"%",
        '生活日用': 20+"%",
        '日常缴费': 5+"%",
        '交通出行': 5+"%",
        '休闲娱乐': 5+"%",
        '医疗保健': 5+"%",
        '住房物业': 5+"%",
        '其他消费': 5+"%",
    };
    data = [
      { name: '餐饮美食', percent: 0.1, a: '1' },
      { name: '服饰美容', percent: 0.1, a: '1' },
      { name: '生活日用', percent: 0.1, a: '1' },
      { name: '日常缴费', percent: 0.2, a: '1' },
      { name: '交通出行', percent: 0.1, a: '1' },
      { name: '休闲娱乐', percent: 0.1, a: '1' },
      { name: '医疗保健', percent: 0.2, a: '1' },
      { name: '住房物业', percent: 0.3, a: '1' },
      { name: '其他消费', percent: 0.1, a: '1' },
    ];
  },
  onShow: function (option) {
    let that = this;
    let yearmonth = DateUtil.getCurYearMonthStr();
    that.setData({
      date: yearmonth
    })
  },
  /**
   * 时间修改
   * @param e
   */
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    });
    let date = e.detail.value
    date = date.split("-");
    date = date[0]+date[1];
    this.queryMonthData(Number.parseInt(date))
  },

  queryMonthData: function(month=DateUtil.getCurYearMonth()){
    DbUtils.queryOrder({
      type: '1',
      month: month,
    }).then(res => {
      console.log(res);
      // 获取总金额
      let allMoney = 0;
      // 每一种消费金额
      let cyms = 0 , fsmr = 0 ,shry = 0 , rcjf = 0, jtcx = 0,
      xxyl = 0 , ylbj = 0 , zfwy = 0, qtxf = 0;


      // 循环获取金额
      for (let i=0; i< res.data.length; i++){
        let consume = res.data[i];
        let tempNum = Number.parseFloat(consume.money);
        allMoney = NumberHandle.add(allMoney,tempNum);
        switch (consume.costtype) {
          case 0 :{
            cyms = NumberHandle.add(cyms,tempNum);
            break;
          }
          case 1 :{
            fsmr = NumberHandle.add(fsmr,tempNum);
            break;
          }
          case 2 :{
            shry = NumberHandle.add(shry,tempNum);
            break;
          }
          case 3 :{
            rcjf = NumberHandle.add(rcjf,tempNum);
            break;
          }
          case 4 :{
            jtcx = NumberHandle.add(jtcx,tempNum);
            break;
          }
          case 5 :{
            xxyl = NumberHandle.add(xxyl,tempNum);
            break;
          }
          case 6 :{
            ylbj = NumberHandle.add(ylbj,tempNum);
            break;
          }
          case 7 :{
            zfwy = NumberHandle.add(zfwy,tempNum);
            break;
          }
          case 8 :{
            qtxf = NumberHandle.add(qtxf,tempNum);
            break;
          }
        }
      }
      console.log("分类:"+cyms+" "+fsmr);
      // 计算占用百分比
      let cyms_ =  NumberHandle.divide(cyms,allMoney).toFixed(2);
      let fsmr_ =  NumberHandle.divide(fsmr,allMoney).toFixed(2);
      let shry_ =  NumberHandle.divide(shry,allMoney).toFixed(2);
      let rcjf_ =  NumberHandle.divide(rcjf,allMoney).toFixed(2);
      let jtcx_ =  NumberHandle.divide(jtcx,allMoney).toFixed(2);
      let xxyl_ =  NumberHandle.divide(xxyl,allMoney).toFixed(2);
      let ylbj_ =  NumberHandle.divide(ylbj,allMoney).toFixed(2);
      let zfwy_ =  NumberHandle.divide(zfwy,allMoney).toFixed(2);
      let qtxf_ =  NumberHandle.divide(qtxf,allMoney).toFixed(2);
      console.log("分类百分比:"+cyms_+" "+cyms_);
      // 构造参数
      // data = [
      //   { name: '餐饮美食', percent: cyms_, a: '1' },
      //   { name: '服饰美容', percent: fsmr_, a: '1' },
      //   { name: '生活日用', percent: shry_, a: '1' },
      //   { name: '日常缴费', percent: rcjf_, a: '1' },
      //   { name: '交通出行', percent: jtcx_, a: '1' },
      //   { name: '休闲娱乐', percent: xxyl_, a: '1' },
      //   { name: '医疗保健', percent: ylbj_, a: '1' },
      //   { name: '住房物业', percent: zfwy_, a: '1' },
      //   { name: '其他消费', percent: qtxf_, a: '1' },
      // ];
      data = [
        { name: '餐饮美食', percent: 0.1, a: '1' },
        { name: '服饰美容', percent: 0.1, a: '1' },
        { name: '生活日用', percent: 0.1, a: '1' },
        { name: '日常缴费', percent: 0.1, a: '1' },
        { name: '交通出行', percent: 0.1, a: '1' },
        { name: '休闲娱乐', percent: 0.1, a: '1' },
        { name: '医疗保健', percent: 0.1, a: '1' },
        { name: '住房物业', percent: 0.3, a: '1' },
        { name: '其他消费', percent: 0.1, a: '1' },
      ];
      // map ={
      //   '餐饮美食': cyms_*100+"%",
      //   '服饰美容': fsmr_*100+"%",
      //   '生活日用': shry_*100+"%",
      //   '日常缴费': rcjf_*100+"%",
      //   '交通出行': jtcx_*100+"%",
      //   '休闲娱乐': xxyl_*100+"%",
      //   '医疗保健': ylbj_*100+"%",
      //   '住房物业': zfwy_*100+"%",
      //   '其他消费': qtxf_*100+"%",
      // }

    })
  }

})