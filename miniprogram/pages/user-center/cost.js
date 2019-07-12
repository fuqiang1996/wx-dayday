import F2 from '../../f2-canvas/lib/f2';

let chart = null;
let map = null;
let data = null;
function initChart(canvas, width, height) { // 使用 F2 绘制图表
                                                     // let map = {
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data, {
    percent: {
      formatter(val) {
        return val * 100 + '%';
      }
    }
  });
  chart.legend({
    position: 'right',
    itemFormatter(val) {
      return val + '  ' + map[val];
    }
  });
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    radius: 0.85
  });
  chart.axis(false);
  chart.interval()
      .position('a*percent')
      .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
      .adjust('stack')
      .style({
        lineWidth: 1,
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
      })
      .animate({
        appear: {
          duration: 1200,
          easing: 'bounceOut'
        }
      });
  chart.render();
  return chart;
}



Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      onInit: initChart
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self.chartComponent = self.selectComponent('#kChart');
    self.chartComponent.init((canvas, width, height, F2) => {
      var data = [
        { name: '芳华', percent: 0.4, a: '1' },
        { name: '妖猫传', percent: 0.2, a: '1' },
        { name: '机器之血', percent: 0.18, a: '1' },
        { name: '心理罪', percent: 0.15, a: '1' },
        { name: '寻梦环游记', percent: 0.05, a: '1' },
        { name: '其他', percent: 0.12, a: '1' }
      ];
      var chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chart.legend({
        position: 'right'
      });
      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 0.85,
        innerRadius: 0.618
      });
      chart.axis(false);
      chart
          .interval()
          .position('a*percent')
          .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
          .adjust('stack')
          .style({
            lineWidth: 1,
            stroke: '#fff',
            lineJoin: 'round',
            lineCap: 'round'
          });

      chart.interaction('pie-select', {
        cancelable: false, // 不允许取消选中
        animate: {
          duration: 300,
          easing: 'backOut'
        },
        onEnd(ev) {
          const { shape, data, shapeInfo, selected } = ev;
          if (shape) {
            if (selected) {
              self.setData({
                message: data.name + ': ' + data.percent * 100 + '%'
              });
            }
          }
        }
      });

      chart.render();
      self.chart = chart;
      return chart;
    });

    map = {
      '芳华': '40%',
      '妖猫传': '20%',
      '机器之血': '18%',
      '心理罪': '15%',
      '寻梦环游记': '5%',
      '其他': '2%',
    };
    data = [
      { name: '芳华', percent: 0.4, a: '1' },
      { name: '妖猫传', percent: 0.2, a: '1' },
      { name: '机器之血', percent: 0.18, a: '1' },
      { name: '心理罪', percent: 0.15, a: '1' },
      { name: '寻梦环游记', percent: 0.05, a: '1' },
      { name: '其他', percent: 0.02, a: '1' }
    ];
  },

})