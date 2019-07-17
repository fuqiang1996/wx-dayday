const DateUtil = require('../../utils/DateUtil');
const DbUtils = require('../../utils/DbUtils');
const NumberHandle = require('../../utils/NumberHandle');
const {StorageUtil} = require('../../utils/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label: '',
    consume:[],
    allMoney:0,
    date: '',
    url:'',
    num:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let yearmonth = DateUtil.getCurYearMonthStr();

    that.setData({
      date: yearmonth,
      url: '/pages/user-center/cost?month='+yearmonth,
    })
  },

  onShow: function (options) {
    let that = this;
    let date = that.data.date;
    date = date.split("-");
    date = date[0]+date[1];
    that.queryOrderBymonth({
      type: '1',
      month: Number.parseInt(date),
    });

    that.queryMonthData(Number.parseInt(date));
  },
  /**
   * 更新或者删除
   */
  updateClick: function (e) {
    let id = e.target.id;
    wx.navigateTo({
      url:"/pages/user-center/updateOrdelete?id="+id,
    })
  },
  /**
   * 时间修改
   * @param e
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      url: '/pages/user-center/cost?month='+e.detail.value,
    });
    let date = e.detail.value
    date = date.split("-");
    date = date[0]+date[1];
    this.queryOrderBymonth({
      type: '1',
      month: Number.parseInt(date),
    });
    this.queryMonthData(Number.parseInt(date));
  },

  /**
   * 查询事项
   * @param query
   */
  queryOrderBymonth: function (query) {
    let that =this;
    DbUtils.queryOrder(query).then(res => {
      let allMoney = 0;
      let consume = [];
      for (let i=0; i< res.data.length; i++){
        let tempNum = Number.parseFloat(res.data[i].money);
        allMoney = NumberHandle.add(allMoney,tempNum);
        consume.push(res.data[i]);
      }
      that.setData({
        consume: consume,
        allMoney: allMoney,
        num: res.data.length,
      })
    })
  },

  // 查询饼图情况
  queryMonthData: function(month=DateUtil.getCurYearMonth()){
    return new Promise((resolve,reject)=>{
      DbUtils.queryOrder({
        type: '1',
        month: month,
      }).then(res => {
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
            case "5" :{
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

        // 计算占用百分比
        let cyms_ =  NumberHandle.divide(cyms,allMoney).toFixed(3);
        let fsmr_ =  NumberHandle.divide(fsmr,allMoney).toFixed(3);
        let shry_ =  NumberHandle.divide(shry,allMoney).toFixed(3);
        let rcjf_ =  NumberHandle.divide(rcjf,allMoney).toFixed(3);
        let jtcx_ =  NumberHandle.divide(jtcx,allMoney).toFixed(3);
        let xxyl_ =  NumberHandle.divide(xxyl,allMoney).toFixed(3);
        let ylbj_ =  NumberHandle.divide(ylbj,allMoney).toFixed(3);
        let zfwy_ =  NumberHandle.divide(zfwy,allMoney).toFixed(3);
        let qtxf_ =  NumberHandle.divide(qtxf,allMoney).toFixed(3);
        // 构造参数
        let data = [
          { name: '餐饮美食', percent: Number.parseFloat(cyms_), a: '1' },
          { name: '服饰美容', percent: Number.parseFloat(fsmr_), a: '1' },
          { name: '生活日用', percent: Number.parseFloat(shry_), a: '1' },
          { name: '日常缴费', percent: Number.parseFloat(rcjf_), a: '1' },
          { name: '交通出行', percent: Number.parseFloat(jtcx_), a: '1' },
          { name: '休闲娱乐', percent: Number.parseFloat(xxyl_), a: '1' },
          { name: '医疗保健', percent: Number.parseFloat(ylbj_), a: '1' },
          { name: '住房物业', percent: Number.parseFloat(zfwy_), a: '1' },
          { name: '其他消费', percent: Number.parseFloat(qtxf_), a: '1' },
        ];
        let map ={
          '餐饮美食': NumberHandle.multiply(cyms_ ,100)+"% "+cyms,
          '服饰美容': NumberHandle.multiply(fsmr_,100)+"% "+fsmr,
          '生活日用': NumberHandle.multiply(shry_,100)+"% "+shry,
          '日常缴费': NumberHandle.multiply(rcjf_,100)+"% "+rcjf,
          '交通出行': NumberHandle.multiply(jtcx_,100)+"% "+jtcx,
          '休闲娱乐': NumberHandle.multiply(xxyl_,100)+"% "+xxyl,
          '医疗保健': NumberHandle.multiply(ylbj_,100)+"% "+ylbj,
          '住房物业': NumberHandle.multiply(zfwy_,100)+"% "+zfwy,
          '其他消费': NumberHandle.multiply(qtxf_,100)+"% "+qtxf,
        }

        let dataColunm = [
          { month: '餐饮', sales: cyms },
          { month: '服美', sales: fsmr },
          { month: '日用', sales: shry },
          { month: '缴费', sales: rcjf },
          { month: '交通', sales: jtcx },
          { month: '娱乐', sales: xxyl },
          { month: '医疗', sales: ylbj },
          { month: '住房', sales: zfwy },
          { month: '其他', sales: qtxf },
        ]
        // 存储到全局变量
        StorageUtil.save('data_',data,false);
        StorageUtil.save('map_',map,false);
        StorageUtil.save('dataColunm',dataColunm,false);
      })

    })

  },


})