<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '../components/home/Header'
import Menu from '../components/home/Menu'
export default {
  name: 'Home',
  components: {
    Header,
    Menu
  }
}
</script>

<style scoped lang="scss">
.home_container {
  height: 100%;
}
.el-container {
  background: #373d41;
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
</style>
