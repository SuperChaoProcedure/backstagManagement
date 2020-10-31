<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索区 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList()"
          >
            <el-button slot="append" @click="getGoodsList()"
              ><i class="el-icon-search"></i
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <!-- 添加按钮 -->
          <el-button type="primary" @click="$router.push('/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域-->
      <el-table :data="goodsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="upd_time" label="创建时间">
          <template slot-scope="scope">
         {{scope.row.upd_time|dateFormat}}
          </template>
          </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 40
      },
      total: ''
    }
  },
  methods: {
    async getGoodsList () {
      const res = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 删除商品
    delGoods (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`goods/${row.goods_id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getGoodsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  // 过滤器
  filters: {
    dateFormat (time) {
      const dt = new Date(time * 1000)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1).toString().padStart(2, '0')
      const d = dt.getDate().toString().padStart(2, '0')
      const h = dt.getHours().toString().padStart(2, '0')
      const M = dt.getMinutes().toString().padStart(2, '0')
      const s = dt.getSeconds().toString().padStart(2, '0')
      return `${y}-${m}-${d}\t${h}:${M}:${s}`
    }
  }
}
</script>
<style scoped lang="less">
</style>
