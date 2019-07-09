const DateUtil = require('../../utils/DateUtil');
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    focus: true,
    takeSession: false,
    requestResult: '',
    consumeObj: {
      name: '',
      money: '',
      time: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  /**
   * 输入
   * @param event
   */
  handleInput:function (event) {
    const field = event.target.id;
    const value = event.detail.value;
    this.setData({
      ['consumeObj.'+field]: value,
    })
  },
  /**
   * 表单提交
   * @param e
   */
  formSubmit:function (e) {
    let cum = this.data.consumeObj;
    cum.time = DateUtil.getCurDate();
    db.collection('consume').add({
      data:{
        consume: cum
      }
    }).then(res =>{
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
      this.setData({
        consumeObj: ""
      })
    });


  },
  /**
   * 清空
   */
  clear:function () {
    this.setData({
      consumeObj: ""
    })
  }
})