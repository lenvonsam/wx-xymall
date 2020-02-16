export default {
  title: { text: '' },
  tooltip: { trigger: 'axis' },
  // legend: { right: 0, selectedMode: 'single', data: ['H型钢', '槽钢', '普碳开平板'], selected: {'H型钢': true} },
  grid: {
    top: '15%',
    left: '1%',
    right: '1%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      show: true,
      rotate: 30,
      textStyle: { color: '#777' },
      formatter: function (value, index) {
        var d = new Date(value)
        var month = d.getMonth() + 1
        var day = d.getDate()
        month = month > 9 ? month : '0' + month
        day = day > 9 ? day : '0' + day
        if (index > 0 && index < 8) {
          return [month, day].join('/')
        }
        return ''
      }
    },
    axisLine: {
      lineStyle: { color: '#bcddfe', width: 1 }
    },
    splitLine: {
      show: true,
      lineStyle: { color: ['#d6e9fc'] }
    }
  },
  yAxis: {
    type: 'value',
    min: function (value) {
      return Math.floor(value.min / 100) * 100 - 100
    },
    max: function (value) {
      return Math.ceil(value.max / 100) * 100 + 100
    },
    axisLabel: {
      show: true,
      textStyle: { color: '#777' }
    },
    minInterval: 100,
    axisLine: {
      lineStyle: { color: '#bcddfe', width: 1 }
    },
    splitArea: { show: false },
    splitLine: {
      show: true,
      lineStyle: { color: ['#d6e9fc'] }
    }
  },
  series: [
    {
      name: 'H型钢',
      type: 'line',
      symbol: 'emptyCircle', // 拐点样式
      symbolSize: 8, // 拐点大小
      smooth: true,
      itemStyle: {
        normal: {
          color: '#409eff',
          lineStyle: {
            width: 2, // 折线宽度
            color: '#409eff' // 折线颜色
          },
          label: { show: false }
        }
      },
      data: []
    }
  ]
}
