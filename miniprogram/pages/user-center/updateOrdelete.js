const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consumeObj:{},
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
    items: [
      {name: '1', value: '花费'},
      {name: '2', value: '收入'},
    ],
    consumeObj: {
      name: '',
      money: '',
      time: '',
      type: '1',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    // 查找记录
    let consume = db.collection('consume').where({
      _id: id
    }).get().then(res =>{

      if(res.data[0].type == '1'){
        this.setData({
          consumeObj: res.data[0],
          index: res.data[0].costtype,
          'items[0].checked': true,
        })
      }else{
        this.setData({
          consumeObj: res.data[0],
          index: res.data[0].costtype,
          'items[1].checked': true,
        })
      }

    });
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
   * 删除
   * @param event
   */
  deleteClick: function (event) {
    db.collection('consume').doc(this.data.consumeObj._id).remove().then(res =>{
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      });
      setTimeout(this.goBack,2000);
    }).catch(res => {
      wx.showToast({
        title: '删除失败',
        icon: 'none',
        duration: 2000
      });
      return;
    });
  },
  /**
   * 保存
   * @param event
   */
  saveClick: function (event) {
    db.collection('consume').doc(this.data.consumeObj._id).update({
          // data 传入需要局部更新的数据
          data: {
            money: this.data.consumeObj.money,
            name: this.data.consumeObj.name,
            costtype: this.data.index,
          }
    }).then(res =>{
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
      setTimeout(this.goBack,2000);
    }).catch(res => {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        });
        return;
    })
  },
  goBack: function(){
    wx.navigateBack({
      delta: 1
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
})