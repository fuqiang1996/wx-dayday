// components/hnisi-form/hnisi-form.js
Component({


  /**
   * 组件的属性列表
   */
  properties: {
    model:{
      type: Object,
      value: {},
    },
    rules:{
      type:Object,
      value: {},
      observer: function(val){

      },
    },
    submitText:{
      type: String,
      value: '提交',
    },
    cancelText:{
      type: String,
      value: '上一步'
    },
    agreeText: String,
    agreeSlot: {
      type: Boolean,
      value: false,
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowTips: false,
    tips: '',
    agree: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 表单提交
     */
    handleSubmit(event){
      // 开始校验
      const model = this.properties.model;
      let cancel = event.mark.cancel;
      this.triggerEvent('submit',{
        ...model,
        cancel
      })
    },
  }
})
