<template>
  <!--一级菜单-->
  <el-menu
    background-color="#333744"
    text-color="#ffff"
    active-text-color="#409FFF"
    unique-opened
    router
    :default-active="$route.path"
  >
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <!--一级菜单模板-->
      <template slot="title">
        <!--图标-->
        <i :class="iconObj[item.id]"></i>
        <!--文本-->
        <span>{{ item.authName }}</span>
      </template>
      <!--二级菜单-->
      <el-menu-item
        :index="'/' + subItem.path"
        v-for="subItem in item.children"
        :key="subItem.id"
      >
        <!--模板-->
        <template slot="title">
          <!--图标-->
          <i class="el-icon-menu"></i>
          <!--文本-->
          <span>{{ subItem.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      // 菜单数据
      menuList: [],
      // 匹配字体图标
      iconObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-platform',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-platform'
      }
    }
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取导航菜单数据失败!')
      }
      this.menuList = res.data
      console.log(this.menuList)
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped lang="scss">
.el-menu {
  margin-top: 8px;
  border-right: none;
}
</style>
