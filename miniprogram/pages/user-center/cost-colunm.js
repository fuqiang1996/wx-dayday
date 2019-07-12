import F2 from '../../f2-canvas/lib/f2';

let chart = null;
let data = [
  { month: '1 月', sales: 4000 },
  { month: '2 月', sales: 2034 },
  { month: '3 月', sales: 61 },
  { month: '4 月', sales: 2000 },
  { month: '5 月', sales: 48 },
  { month: '6 月', sales: 38 },
  { month: '7 月', sales: 38 },
  { month: '8 月', sales: 38 },
];
function initChart(canvas, width, height) {

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    sales: {
      tickCount: 5
    }
  });
  chart.tooltip(false);
  chart.interval().position('month*sales');
  chart.render();

  // 绘制柱状图文本
  const offset = -5;
  const chartCanvas = chart.get('canvas');
  const group = chartCanvas.addGroup();
  const shapes = {};
  data.map(obj => {
    const point = chart.getPosition(obj);
    const text = group.addShape('text', {
      attrs: {
        x: point.x,
        y: point.y + offset,
        text: obj.sales,
        textAlign: 'center',
        textBaseline: 'bottom',
        fill: '#808080'
      }
    });

    shapes[obj.month] = text; // 缓存该 shape, 便于后续查找
  });

  let lastTextShape; // 上一个被选中的 text
  // 配置柱状图点击交互
  chart.interaction('interval-select', {
    selectAxisStyle: {
      fill: '#000',
      fontWeight: 'bold'
    },
    mode: 'range',
    onEnd(ev) {
      const { data, selected } = ev;
      lastTextShape && lastTextShape.attr({
        fill: '#808080',
        fontWeight: 'normal'
      });
      if (selected) {
        const textShape = shapes[data.month];
        textShape.attr({
          fill: '#000',
          fontWeight: 'bold'
        });
        lastTextShape = textShape;
      }
      chartCanvas.draw();
    }
  });
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'F2 微信小程序图表组件，你值得拥有~',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    opts: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
