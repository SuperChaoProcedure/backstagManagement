<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        effect="dark"
      >
      </el-alert>
      <!-- 警告 -->
      <!-- 级联选择器 -->
      <div class="header">
        <span>商品分类 </span>
        <!-- 级联选择器 -->
        <el-cascader
          clearable
          v-model="selectCategoryId"
          :options="CategoriesList"
          :props="{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
          }"
          @change="handleChange"
          size="medium "
        ></el-cascader>
        <!-- 级联选择器 -->
      </div>
      <!-- 级联选择器 -->
      <!-- 参数tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isok"
            @click="autoFocus"
            >添加参数</el-button
          >
          <!-- 添加按钮 -->
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isok"
            @click="autoFocus"
            >添加参数</el-button
          >
          <!-- 添加按钮 -->
        </el-tab-pane>
      </el-tabs>
      <!-- 参数tab栏 -->

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column type="expand">
        <template slot-scope="scope">
           <el-tag
            :key="tag"
            v-for="tag in scope.row.attr_vals"
            closable
             @close="handleClose(scope.row,tag)"
          >
          {{tag}}
          </el-tag>
          <el-input
          class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
          >
          </el-input>
          <el-button
            v-else
            size="small"
           @click="showInput"
            >+ New Tag</el-button
          >
        </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="attr_name" :label="isName"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editParams(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delParams(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格区域 -->
    </el-card>

    <!-- 编辑参数对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%">
      <!-- 内容区域 -->
      <span>{{ isName }} </span>
      <el-input
        ref="editInput"
        class="editInput"
        v-model="queryInfo.attr_name"
        @keyup.enter.native="editSure"
      ></el-input>
      <!-- 内容区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + isName"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <!-- 内容区域 -->
      <el-input
        ref="addInput"
        class="addInput"
        v-model="addInfo.attr_name"
        @keyup.enter.native="addParams"
        clearable
      ></el-input>
      <!-- 内容区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加参数对话框 -->
  </div>
</template>

<script>
import Bus from '@/components/Bus/bus'
export default {
  name: 'Params',
  created () {
    this.getCategoriesList()
  },
  data () {
    return {
      CategoriesList: [],
      selectCategoryId: [], // 所有被选中的分类id
      // 分类id
      CategoryId: '', // 三级分类id
      activeName: 'many',
      queryInfo: {
        attr_name: '', // 编辑后的属性名
        attr_sel: ''
      },
      addInfo: {
        attr_name: '', // 编辑后的属性名
        attr_sel: ''
      },
      attr_id: '', // 属性id
      isok: true, // 是否禁用添加参数按钮
      tableData: [],
      editDialogVisible: false, // 隐藏编辑对话框
      addDialogVisible: false, // 隐藏添加参数对话框
      inputVisible: false, // tag输入框是否显示
      inputValue: '' // tag输入框中的值
    }
  },
  methods: {
    async getCategoriesList () {
      const res = await this.$http.get('categories')
      this.CategoriesList = res.data
      Bus.$emit('categories', res.data)// 兄弟组件传值
    },
    // 选择改变触发
    handleChange (val) {
      // 如果选择的不是第三级分类则不被选中在选择框中
      if (val.length !== 3) {
        this.selectCategoryId = []
        return
      }
      this.isok = false // 将添加商品按钮打开
      this.CategoryId = this.selectCategoryId[val.length - 1]
      // 书写tags标签逻辑
      this.getData()
    },
    // 获取对应分类的参数列表
    async getData () {
      const res = await this.$http.get(
        `categories/${this.CategoryId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.tableData = res.data
      this.tableData.forEach(item => {
        // 判断attr_vals属性是否为空,为空就不显示
        if (!item.attr_vals) {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(' ')
        }
      })
    },
    // tab栏切换时触发的函数
    async handleClick () {
      if (this.selectCategoryId.length === 3) {
        this.getData()
      }
    },
    // 删除参数
    async delParams (row) {
      const results = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (results === 'confirm') {
        const res = await this.$http.delete(
          `categories/${this.CategoryId}/attributes/${row.attr_id}`
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getData()
      }
    },
    // 编辑参数
    editParams (row) {
      this.attr_id = row.attr_id
      this.queryInfo.attr_name = row.attr_name
      this.editDialogVisible = true // 显示编辑对话框
      // 等待input加载到dom中后在对他进行操作
      this.$nextTick(() => {
        this.$refs.editInput.select() // 实现输入框打开后被选中
      })
    },
    // 编辑确认
    async editSure () {
      this.queryInfo.attr_sel = this.activeName // 记录此时为静态属性还是动态属性赋值给请求参数
      const res = await this.$http.put(
        `categories/${this.CategoryId}/attributes/${this.attr_id}`,
        this.queryInfo
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getData() // 更新视图
      this.editDialogVisible = false
    },
    // 点击添加参数自动获取焦点
    autoFocus () {
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs.addInput.focus()
      })
    },
    // 添加参数对话框
    async addParams () {
      this.addInfo.attr_sel = this.activeName // 记录此时为静态属性还是动态属性赋值给请求参数
      const res = await this.$http.post(`categories/${this.CategoryId}/attributes`, this.addInfo)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getData()// 更新视图
      this.addDialogVisible = false
      this.$refs.addInput.$refs.input.value = ''
    },
    // tags标签关闭执行
    async   handleClose (row, tagItem) {
      // 找到关闭对应的索引号
      const index = row.attr_vals.findIndex(item => item === tagItem)
      row.attr_vals.splice(index, 1)
      const res = await this.$http.put(`categories/${this.CategoryId}/attributes/${row.attr_id}`,
        { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    },
    // 添加tags
    async handleInputConfirm (row) {
      // this.inputValue输入框中的值
      if (this.inputValue.trim() === '') {
        this.inputVisible = false
        return
      }
      row.attr_vals.push(this.inputValue)
      const res = await this.$http.put(`categories/${this.CategoryId}/attributes/${row.attr_id}`,
        { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.inputValue = ''
      this.inputVisible = false// 让按钮显示,输入框隐藏
    },
    // 显示input输入框
    showInput () {
      this.inputVisible = true
      // 等待dom元素都加载完毕在执行这个回调函数
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    }

  },

  computed: {
    isName () {
      const result = this.activeName === 'many' ? '动态参数' : '静态参数'
      return result
    }
  }
}
</script>
<style scoped lang="less">
.header {
  margin-top: 10px;
}
.editInput {
  width: 80%;
}
.addInput {
  width: 100%;
}
.el-tag{
  margin-right: 10px;
}
.input-new-tag {
    width: 90px;
  }
</style>
