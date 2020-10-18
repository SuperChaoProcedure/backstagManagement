<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 栅格布局 -->
      <el-row>
        <!-- 搜索区域 -->
        <el-col :span="8">
          <!-- input输入框 -->
          <el-input placeholder="请输入内容" v-model="content" @keyup.enter.native="serchUsers">
            <template slot="append">
              <el-button class="el-icon-search" @click="serchUsers"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="16">
          <div>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="UsersList" style="width: 100%" stripe border>
        <el-table-column label="#" type="index" width="100"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <!-- switch开关 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="gray"
              @change="changeState(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作部分按钮 -->
        <el-table-column label="操作" width="220">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-share"
              size="mini"
            ></el-button>
            <!-- 文字提示 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" @keyup.enter.native="addUsers"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created () {
    this.getUsersList()
  },
  data () {
    var checkpwd = (rule, value, callback) => {
      const regExp = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!regExp.test(value)) {
        callback(new Error('手机格式错误'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      const regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (!regExp.test(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      UsersList: [], // 获取用户数据
      total: null, // 总页码数
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }, // 初始化添加角色请求
      addDialogVisible: false,
      // 表单验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkpwd, trigger: 'blur' }
        ]
      },
      content: ''
    }
  },
  methods: {
    async getUsersList () {
      const res = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.UsersList = res.data.users
      this.total = res.data.total
    },
    // 状态发生改变时触发
    async changeState (id, state) {
      const res = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 添加用户
    addUsers () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('校验失败')
        const res = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUsersList()
        this.addDialogVisible = false
      })
    },
    // 监听页面跳转
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getUsersList()
    },
    handleCurrentChange (page) {
      this.queryInfo.pagenum = page
      this.getUsersList()
    },
    // 根据关键字搜索用户
    serchUsers () {
      this.queryInfo.query = this.content
      this.getUsersList()
      this.content = ''
    }
  }
}
</script>
<style scoped lang="less">
.el-col.el-col-16 {
  padding-left: 20px;
}
.el-pagination {
  margin-top: 10px;
}
</style>
