<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>报表列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width:80%; height:400px;margin:0 auto"></div>
    </el-card>
  </div>
</template>
<script>
// import echarts from 'echarts'//体积大浪费
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
// 引入折线图
import 'echarts/lib/chart/line'
import merge from 'lodash/merge'
export default {
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ]
    }
    const res = await this.$http.get('reports/type/1')
    option = merge(option, res.data)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>
<style scoped lang="less">

</style>
