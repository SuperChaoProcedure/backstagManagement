<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
      <!-- 消息提示 -->
      <!-- 步骤条 -->
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤条 -->

      <!-- from表单区域 -->
      <el-form
        ref="form"
        :model="queryInfo"
        :rules="formRules"
        label-position="top"
      >
        <!-- 侧边导航 -->
        <el-tabs
          tab-position="left"
          style="height: 200px"
          @tab-click="tabClick"
          :before-leave="beforeClick"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="queryInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="queryInfo.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="queryInfo.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="queryInfo.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="queryInfo.goods_cat"
                :options="goodsList"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                }"
              ></el-cascader>
              <!-- 级联选择器 -->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数(动态)">
            <el-form-item :label="item.attr_name" v-for="(item,index) in ParamsList" :key="index">
                <el-checkbox checked :label="item1" v-for="(item1,index) in item.attr_vals" :key="index"></el-checkbox>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性(静态)">
               <el-form-item :label="item.attr_name" v-for="(item,index) in ParamsList" :key="index">
                <el-input :value="item1" v-for="(item1,index) in item.attr_vals" :key="index"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="queryInfo.goods_instroduce"> </quill-editor>
           <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
        <!-- 侧边导航 -->
      </el-form>
      <!-- from表单区域 -->
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Add',
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      active: 0,
      queryInfo: {
        goods_name: '1',
        goods_price: 0,
        goods_number: 1,
        goods_weight: 0,
        goods_cat: [],
        goods_instroduce: ''
      },
      // 表单验证规则
      formRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      goodsList: [],
      ParamsList: []
    }
  },
  methods: {
    async getGoodsList () {
      const res = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data
    },
    // tab侧边栏被点击触发事件
    tabClick (val) {
      // 根据val.paneName判断点击的是动态参数还是静态参数
      if (val.paneName === '1') {
        this.getParams('many')
      }
      if (val.paneName === '2') {
        this.getParams('only')
      }
    },
    // tab切换之前触发
    beforeClick (name, oldName) {
      let flag = true
      // 是否点击下一级
      if (name !== '0') {
        this.$refs.form.validate((valid) => {
          // 表单是否每项都填了
          if (!valid) {
            this.$message.warning('请检查表单')
            flag = valid // 验证不通过返回false阻止跳转到下一级
            return
          }
          // 判断是否是选择了三级分类
          flag = this.queryInfo.goods_cat.length !== 3 ? false : true; // eslint-disable-line
          // 错误判断
          if (!flag) {
            return this.$message.warning('请检查分类是否为三级')
          }
          // 如果flag为true时说明可以跳转那么active的值也要改变
          this.active = parseInt(name)
        })
      }
      return flag
    },
    // 封装动或静态参数ajax数据请求
    async  getParams (attr) {
      const res = await this.$http.get(`categories/${this.queryInfo.goods_cat[2]}/attributes`, { params: { sel: attr } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        if (item.attr_vals === '') {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(',')
        }
      })
      this.ParamsList = res.data
      console.log(this.ParamsList)
    },
    async addGoods () {
      // 深拷贝
      var form = cloneDeep(this.queryInfo)
      form.goods_cat = form.goods_cat.join(',')
      const res = await this.$http.post('goods', form)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.$router.push('/goods')
    }
  }
}
</script>
<style scoped lang="less">
.el-steps {
  margin: 20px 0;
  /deep/ .el-step__title {
    font-size: 12px;
  }
}
.el-tabs {
  height: 100% !important;
}
 /deep/ .ql-container{
  height: 200px;
}
</style>
