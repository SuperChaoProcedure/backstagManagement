<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="addCate">添加分类</el-button>
      <!-- 添加分类按钮 -->
      <!-- 表格区域 -->
      <tree-table
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        show-index
        :expand-type="false"
        border
        stripe
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: green"
            v-if="scope.row.cat_deleted === false"
          >
          </i>
          <i class="el-icon-error" style="color: red" v-else> </i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            type="success"
            >二级</el-tag
          >
          <el-tag v-else size="mini" type="info">三级</el-tag>
        </template>
        <template slot="caozuo" slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary"></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="delCategory(scope.row)"
          ></el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 分页区域 -->
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="30%">
      <!-- 内容区域 -->
      <el-form
        label-width="80px"
        ref="cateRef"
        :model="addInfo"
        :rules="CategoryRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addInfo.cat_name" ref="Input"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="categoryId"
            :options="options"
            :props="{
              checkStrictly: true,
              value: 'cat_id',
              label: 'cat_name',
            }"
            clearable
          ></el-cascader>
          <!-- 级联选择器 -->
        </el-form-item>
      </el-form>
      <!-- 内容区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类对话框 -->
  </div>
</template>

<script>
import Bus from '@/components/Bus/bus'
// import { cloneDeep } from 'lodash'
export default {
  name: 'Categories',
  created () {
    this.getCategoriesList()
    // 应用兄弟组件传值
    Bus.$on('categories', (data) => {
      // console.log(data)// 兄弟组件传来的值
    })
  },
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: localStorage.getItem('pagesize') - 0 || 4 // 持久化每页显示条数的修改
      },
      total: null,
      categoriesList: [],
      props: {
        stripe: false,
        border: false,
        treeType: true
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'caozuo'
        }
      ],
      addDialogVisible: false, // 添加分类对话框隐藏
      // 添加分类参数
      addInfo: {
        cat_name: ''
      },
      CategoryRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },
      categoryId: [], // 分类id
      options: []
    }
  },
  methods: {
    async getCategoriesList () {
      const res = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 删除分类
    delCategory (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`categories/${row.cat_id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getCategoriesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // pagesize改变触发
    handleSizeChange (size) {
      localStorage.setItem('pagesize', size)// 新选择的size存储到本地
      this.queryInfo.pagesize = size
      this.getCategoriesList()
    },
    // 当前页改变触发
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getCategoriesList()
    },
    // 打开添加分类对话框
    addCate () {
      this.addOption()
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs.Input.focus()
      })
    },
    // 取消时清空表单中的数据
    cancel () {
      this.$refs.cateRef.resetFields()
      this.categoryId = []
      this.addDialogVisible = false
    },
    // 添加分类
    addSure () {
      // cat_id和cat_pid坑 由于添加往往都是往下一级添加所以目前的cat_id就可以被认为是cat_pid (所以获取的数据是前一级并非全部获取)
      var pid
      if (this.categoryId.length === 0) {
        pid = 0
      } else {
        pid = this.categoryId[this.categoryId.length - 1]
      }
      this.$refs.cateRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const res = await this.$http.post('categories', {
          cat_pid: pid,
          cat_name: this.addInfo.cat_name,
          cat_level: this.categoryId.length
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$refs.cateRef.resetFields()
        this.categoryId = []
        this.getCategoriesList()
        this.addDialogVisible = false
      })
    },
    // 添加分类获取数据
    async addOption () {
      const res = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.options = res.data
    }
  }

}
</script>
<style scoped lang="less">
.zk-table {
  margin-top: 10px;
}
</style>
