const DateUtil = require('../../utils/DateUtil');
const DbUtils = require('../../utils/DbUtils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label: '',
    consume:[],
    allMoney:0,
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let yearmonth = DateUtil.getCurYearMonthStr();

    that.setData({
      date: yearmonth
    })
  },

  onShow: function (options) {
    let date = this.data.date;
    date = date.split("-");
    date = date[0]+date[1];
    this.queryOrderBymonth({
      type: '1',
      month: Number.parseInt(date),
    });
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    });
    let date = e.detail.value
    date = date.split("-");
    date = date[0]+date[1];
    this.queryOrderBymonth({
      type: '1',
      month: Number.parseInt(date),
    });
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
        allMoney += Number.parseFloat(res.data[i].money);
        consume.push(res.data[i]);
      }
      that.setData({
        consume: consume,
        allMoney: allMoney,
      })
    })
  }
})