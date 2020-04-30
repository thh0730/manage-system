<template>
  <div class="right_container">
    <!--面包屑-->
    <Breadcrumb title="权限管理" sub-title="权限列表"></Breadcrumb>

    <!--卡片视图-->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column align="center" prop="path" label="路径">
        </el-table-column>
        <el-table-column align="center" prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
export default {
  name: 'Rights',
  components: {
    Breadcrumb
  },
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败!')
      this.$message.success('获取权限列表成功!')
      this.rightsList = res.data
    }
  }
}
</script>

<style scoped></style>
