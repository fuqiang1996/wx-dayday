const db = wx.cloud.database({});

module.exports = {

  queryOrder: function (item) {
    return new Promise((resolve, reject) =>{
      const MAX_LIMIT = 20;
      // 先取出集合记录总数
      db.collection('consume').count().then(res=>{
        const total = res.total
        // 计算需分几次取
        const batchTimes = Math.ceil(total / 20)

        // 承载所有读操作的 promise 的数组
        const tasks = []
        for (let i = 0; i < batchTimes; i++) {
          const promise = db.collection('consume').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(item).get()
          tasks.push(promise)
        }
        return Promise.all(tasks).then((res) => {
          let arr = []
          for (let i = 0; i < batchTimes; i++) {
            arr.push(...res[i].data);
          }
          return resolve({
            data: arr
          });
        });
      });

    })
  }


}