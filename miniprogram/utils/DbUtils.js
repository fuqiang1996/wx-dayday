const db = wx.cloud.database({});
module.exports = {

  queryOrder: function (item) {
    return new Promise((resolve, reject) =>{
      db.collection('consume').where(item).get().then(res => {
        return resolve(res);
      });
    })
  }

}