<template>
  <div class="box">
    <!--面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ title }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ subTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    subTitle: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  margin-bottom: 20px;
}
</style>
