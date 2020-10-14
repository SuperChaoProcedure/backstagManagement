<template>
  <div class="container">
    <el-container>
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
        <el-aside width="200px">
          <el-menu
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu :index="item.id+'' " v-for="item in MenuList" :key="item.id">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
               <el-menu-item index="1-2" v-for="item in item.children" :key="item.id">
                  <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
               </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      MenuList: []
    }
  },
  // 钩子
  created () {
    this.getMenuList()
  },
  methods: {
    logOut () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async  getMenuList () {
      const menu = await this.$http.get('menus')
      this.MenuList = menu.data
    }
  }
}
</script>
<style scoped lang="less">
.container {
  height: 100%;
  background-color: #eaedf1;

  .el-container {
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
      .el-button {
      }
    }

    .el-aside {
      height: 100%;
      background-color: #373d41;
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      line-height: 160px;
    }
  }
}
</style>
