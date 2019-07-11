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

  },

  onShow: function (options) {
    let that =this;
    db.collection('consume').where({
      type: '2',
    }).get().then(res => {
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


})