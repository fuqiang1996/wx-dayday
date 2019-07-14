
const USER_INFO = "userInfo";
const VALIDATE_FACE_TOKENS = "validateFaceTokens";
const NAVIGATION = "navigation";

/**
 * 存储工具类
 */
class StorageUtil {

  /**
   * 保存用户信息
   */
  static saveUserInfo(userInfo){
    return StorageUtil.save(USER_INFO,userInfo);
  }

  /**
   * 读取用户信息
   */
  static loadUserInfo(){
    return StorageUtil.load(USER_INFO);
  }

  /**
   * 清除用户信息
   */
  static clearUserInfo(){
    return StorageUtil.saveUserInfo(null);
  }

    /**
     * 保存人脸识别验证码
     * 保存结果为map
     * @param idcard 身份证号
     * @param token 人脸识别凭证
     * @param expired 有效期，默认10分钟
     */
  static saveValidateFaceToken(idcard,token,expired=new Date().getTime()+10*60*1000){

    //读取已有的token
    let validateFaceTokens = StorageUtil.loadValidateFaceToken();
    if(typeof validateFaceTokens === 'object' && validateFaceTokens != null){
      validateFaceTokens[idcard] = {
        token: token,
        expired: expired
      };
    }else{
      validateFaceTokens = {
        [idcard]: {
          token: token,
          expired: expired
        }
      };
    }

    return StorageUtil.save(VALIDATE_FACE_TOKENS,validateFaceTokens,true);
    
  }

  /**
   * 读取人脸识别验证码
   */
  static loadValidateFaceToken(idcard){
    if (idcard === undefined){
      const tokens = StorageUtil.load(VALIDATE_FACE_TOKENS);
      if(tokens == null){
        return null;
      }

      // 过滤过期的token
      Object.keys(tokens).forEach(idcard=>{
        // tokens[idcard]如果为空，则删除掉
        if(!tokens[idcard]){
          delete tokens[idcard]
        }else{
          const expired = tokens[idcard].expired;
          if(expired < new Date().getTime()){
            delete tokens[idcard];
          }
        }

      });

      //避免改变globalData中的数据，深度复制一次
      const resultTokens = JSON.parse(JSON.stringify(tokens));
      Object.keys(resultTokens).forEach(idcard=>{
        resultTokens[idcard] = resultTokens[idcard].token;
      });
      return resultTokens;
    }else if(idcard === null){
      return null;
    }else{
      const tokens = StorageUtil.loadValidateFaceToken();
      if(tokens == null){
        return null;
      }

      return tokens[idcard];
    }
    
  }

  /**
   * 清除人脸识别验证码
   */
  static clearValidateFaceToken(idcard){
    if(idcard === undefined){
      return StorageUtil.save(VALIDATE_FACE_TOKENS, {});
    }else if(idcard === null){
      return null;
    }else{
      const token = StorageUtil.loadValidateFaceToken(idcard);
      if(token != null){
        return StorageUtil.saveValidateFaceToken(idcard,null);
      }
    }
  }

  static saveNavigation(navigation){
    return StorageUtil.save(NAVIGATION,navigation);
  }

  static loadNavigation(){
    return StorageUtil.load(NAVIGATION);
  }

  //保存数据至globalData和storage中，默认异步
  static save(key,value,isAsync=true){
    //存储globalData
    StorageUtil.saveToGlobal(key, value);
    //存储storage
    return StorageUtil.saveToStorage(key, value, isAsync);
  }

  //读取数据，默认同步
  static load(key,isAsync=false){
    //优先尝试从globalData中读取数据
    let data = StorageUtil.loadFromGlobal(key);
    if(data != null){
      if(isAsync){
        return new Promise((resolve,reject)=>{
          return resolve(data);
        })
      }else{
        return data;
      }
    }
    //如果没有，再从storage中读取
    if(isAsync){
      return StorageUtil.loadFromStorage(key, true).then(data=>{
        StorageUtil.saveToGlobal(key,data);
        return data;
      });
    }else{
      data = StorageUtil.loadFromStorage(key, false);
      StorageUtil.saveToGlobal(key,data);
      return data;
    }
    
  }
  
  /**
   * 保存数据至app.globalData
   */
  static saveToGlobal(key,value){
    getApp().globalData[key] = value;
  }

  /**
   * 读取数据从app.globalData
   */
  static loadFromGlobal(key) {
    return getApp().globalData[key];
  }

  /**
   * 存储数据至storage中
   * @param {string} key 键
   * @param {Object|String} data 数据
   * @param {bool} [isAsync=false] 是否异步处理，默认同步
   * 默认同步存储
   */
  static saveToStorage(key,data,isAsync = false){
    return new Promise((resolve,reject)=>{
      if(isAsync){
        //异步处理
        wx.setStorage({
          key: key,
          data: data,
          success: ()=>{
            return resolve();
          },
          fail: ()=>{
            return reject();
          }
        })
      }else{
        //同步处理
        wx.setStorageSync(key, data);
        return resolve();
      }
    });
  }

  /**
   * 读取数据从storage
   * @param key 键
   * @param {bool} [isAsync=false] 是否异步处理，默认同步
   */
  static loadFromStorage(key, isAsync = false) {
    if (isAsync) {
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key: key,
          success: function(res) {
            return resolve(res);
          },
        })
      })
    }else{
      return wx.getStorageSync(key);
    }
    
  }
  
}

module.exports = {
  StorageUtil: StorageUtil
}