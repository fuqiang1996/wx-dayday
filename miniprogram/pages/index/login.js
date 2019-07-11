const DateUtil = require('../../utils/DateUtil');
const UUID = require('../../utils/UUID');
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['餐饮美食','服饰美容', '生活日用', '日常缴费', '交通出行','休闲娱乐','医疗保健','住房物业','其他消费'],
    objectArray: [
      {
        id: 0,
        name: '餐饮美食'
      },
      {
        id: 1,
        name: '服饰美容'
      },
      {
        id: 2,
        name: '生活日用'
      },
      {
        id: 3,
        name: '日常缴费'
      },
      {
        id: 4,
        name: '交通出行'
      },
      {
        id: 5,
        name: '休闲娱乐'
      },
      {
        id: 6,
        name: '医疗保健'
      },
      {
        id: 7,
        name: '住房物业'
      },
      {
        id: 8,
        name: '其他消费'
      },
    ],
    index: 0, // 类型
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    focus: true,
    takeSession: false,
    requestResult: '',
    items: [
      {name: '1', value: '花费',checked: 'true'},
      {name: '2', value: '收入'},
    ],
    consumeObj: {
      name: '',
      money: '',
      time: '',
      type: '1',
    },
    disable: false,
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
    if(cum.type == '1'){
      cum.costtype = this.data.index;
    }
    cum.time = DateUtil.getCurDate();
    cum.month = DateUtil.getCurYearMonth();

    db.collection('consume').add({
      data:{
        ...cum,
      }
    }).then(res =>{
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
      this.setData({
        'consumeObj.name': "",
        'consumeObj.money': "",
      })
    });
  },
  /**
   * 清空
   */
  clear:function () {
    this.setData({
      'consumeObj.name': "",
      'consumeObj.money': "",
    })
  },
  /**
   * 单选事件
   * @param e
   */
  radioChange: function(e) {
    this.setData({
      'consumeObj.type': e.detail.value,
    })
  },
  /**
   * 选择器
   * @param e
   */
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})