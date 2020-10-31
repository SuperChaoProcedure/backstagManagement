<template>
<div>
    <!-- 面包屑 -->
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区域 -->
  <el-card>
     <el-table
      :data="lightsList"
      style="width: 100%"
      stripe
      border
      >
       <el-table-column
       type="index"
        label="#"
        width="50"
        >
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="400"
        >
      </el-table-column>
      <el-table-column  label="权限等级" >
       <template slot-scope="scope">
        <el-tag v-if="scope.row.level==='0'">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
        <el-tag type="info" v-else>三级</el-tag>
       </template>
      </el-table-column>
    </el-table>

  </el-card>
</div>
</template>
<script>
export default {
  created () {
    this.getLightsList()
  },
  data () {
    return {
      lightsList: []
    }
  },
  methods: {
    async getLightsList () {
      const res = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.lightsList = res.data
    }
  }
}
</script>
<style scoped lang="less">

</style>
