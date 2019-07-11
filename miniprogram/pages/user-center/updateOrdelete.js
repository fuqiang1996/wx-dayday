const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consumeObj:{},
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
      this.setData({
        consumeObj: res.data[0],
      })
    });
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
  }
})