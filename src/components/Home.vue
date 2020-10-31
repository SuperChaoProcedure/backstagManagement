<template>
    <el-container class="home-container">
      <!-- header区域 -->
      <el-header>
        <div>
          <img src="../assets/images/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logOut">退出</el-button>
      </el-header>
      <el-container>
        <!-- menu区域 -->
        <el-aside :width="isActive?'60px':'200px'">
          <!-- 收缩菜单 -->
          <div class="mnus"  @click="shousuo">|||</div>
          <el-menu
            background-color="#373d41"
            text-color="#fff"
            active-text-color="yellow"
            unique-opened
            :collapse="isActive"
            :default-active="IndexParams"
            router
          >
            <el-submenu
              :index="item.id + ''"
              v-for="item in MenuList"
              :key="item.id"
            >
              <!-- 一级菜单 -->
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+item.path "
                v-for="item in item.children"
                :key="item.id"
                @click="toggleActivePath(`/${item.path}`)"
              >
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ item.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  // 给组件起个名字
  home: 'Home',
  // 钩子
  created () {
    this.getMenuList()
    this.IndexParams = window.sessionStorage.getItem('path')
  },
  data () {
    return {
      MenuList: [],
      isActive: false, // 是否折叠菜单
      IndexParams: ''
    }
  },
  methods: {
    // 退出
    logOut () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 给菜单添加不同icon图标
    async getMenuList () {
      const menu = await this.$http.get('menus')
      const iconsObj = {
        102: 'iconfont icon-users',
        125: 'iconfont icon-3702mima',
        101: 'iconfont icon-shangpin',
        145: 'iconfont icon-baobiao',
        103: 'iconfont icon-danju'
      }
      menu.data.forEach((item) => {
        item.icon = iconsObj[item.id]
      })
      this.MenuList = menu.data
    },
    // 收缩菜单
    shousuo () {
      this.isActive = !this.isActive
    },
    // 页面刷新打开的菜单
    toggleActivePath (index) {
      this.IndexParams = index
      window.sessionStorage.setItem('path', index)
    }
  }
}
</script>
<style scoped lang="less">
.home-container{
  height: 100%;
  .el-header {
      display: flex;
      justify-content: space-between;
      padding-left: 0;
      align-items: center;
      height: 60px;
      background-color: #373d41;
      img {
        vertical-align: middle;
      }
      span {
        font-size: 20px;
        color: #ffffff;
        margin-left: 10px;
      }
    }
  .el-container {
    .el-aside {
      background-color: #373d41;
      .el-menu {
        border-right: none;
      }
      .mnus {
        line-height: 30px;
        background-color: #4a5064;
        text-align: center;
        letter-spacing: 3px;
      }
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
    }
  }
}
</style>
