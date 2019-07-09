const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label: '',
    consume:[],
    allMoney:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('consume').get().then(res => {
      let allMoney = 0;
      let consume = [];
      for (let i=0; i< res.data.length; i++){
        allMoney += Number.parseInt(res.data[i].consume.money);
        consume.push(res.data[i].consume);
      }
      this.setData({
        consume: consume,
        allMoney: allMoney,
      })
    })
  },


})