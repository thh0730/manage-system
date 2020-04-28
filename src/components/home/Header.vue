<template>
  <div class="home-header">
    <div>
      <img src="../../assets/images/houtaiguanli.png" alt="" />
      <span>数字商品后台</span>
    </div>
    <el-button type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped lang="scss">
.home-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 30px;
  color: #ffffff;
  > div {
    display: flex;
    align-items: center;
    > span {
      padding-left: 10px;
    }
  }
}
</style>
