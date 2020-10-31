<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >

      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand" label="展开" width="180">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              class="level1"
            >
              <!-- {{scope.row.children}}查看数据 -->
              <el-col :span="5">
                <el-tag closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="5">
                    <el-tag closable type="success">{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="closeTag(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUsers(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUsers(scope.row)"
            ></el-button>
            <!-- 文字提示 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="rightsAllot(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="30%">
      <!-- 对话框内容 -->
      <el-form ref="form" :model="addForm" label-width="80px">
        <el-form-item label="角色名称:">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:">
          <el-input
            v-model="addForm.roleDesc"
            @keyup.enter.native="addUsers"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%">
      <!-- 对话框内容 -->
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="角色名称:">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:">
          <el-input
            v-model="editForm.roleDesc"
            @keyup.enter.native="editSure"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSure"
          >确 定</el-button>
      </span>
    </el-dialog>

<!-- 分配权限对话框 -->
<el-dialog
  title="提示"
  :visible.sync="AllotDialogVisible"
  width="30%"
  >
  <!-- 树形控件 -->
    <el-tree
  :data="TreeData"
  show-checkbox
  default-expand-all
  node-key="id"
  :default-checked-keys="expandArr"
  ref="tree"
  highlight-current
  :props="{children:'children',label:'authName'}"
  >
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="AllotDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="rightsUsers">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      rolesList: [],
      addDialogVisible: false, // 添加角色对话框
      addForm: { roleName: '', roleDesc: '' },
      editForm: { roleName: '', roleDesc: '' },
      editDialogVisible: false,
      roleId: '',
      AllotDialogVisible: false, // 树形弹框隐藏
      TreeData: [],
      expandArr: []//  默认勾选的节点的 key 的数组
    }
  },
  methods: {
    async getRolesList () {
      const res = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 添加用户
    async addUsers () {
      const res = await this.$http.post('roles', this.addForm)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.addDialogVisible = false
    },
    // 删除tags标签
    async closeTag (row, RightsId) {
      const res = await this.$http.delete(`roles/${row.id}/rights/${RightsId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      row.children = res.data
    },
    delUsers (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${row.id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑提交角色
    editUsers (row) {
      this.roleId = row.id
      this.editForm.roleDesc = row.roleDesc
      this.editForm.roleName = row.roleName
      this.editDialogVisible = true
    },
    // 编辑确认
    async editSure () {
      const res = await this.$http.put(`roles/${this.roleId}`, this.editForm)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.editDialogVisible = false
    },
    // 分配权限
    async rightsAllot (row) {
      this.roleId = row.id
      this.expandArr = []
      const res = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.TreeData = res.data
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.expandArr.push(item3.id)
          })
        })
      })
      this.AllotDialogVisible = true
    },
    // 角色授权
    async rightsUsers () {
      console.log(this.$refs.tree.getHalfCheckedKeys())
      console.log(this.$refs.tree.getCheckedKeys())
      const arr = [].concat(this.$refs.tree.getHalfCheckedKeys(), this.$refs.tree.getCheckedKeys()).join(',')
      const res = await this.$http.post(`roles/${this.roleId}/rights`, { rids: arr })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    }
  }
}
</script>
<style scoped lang="less">
.el-tag {
  margin: 10px;
}
.level1:nth-child(even) {
  background-color: #ccc;
}
.level1:nth-child(odd) {
  background-color: rgb(221, 182, 182);
}
</style>
