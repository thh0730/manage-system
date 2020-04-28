<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="pagesizes"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  >
  </el-pagination>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pagenum: Number,
    pagesize: Number,
    total: Number,
    pagesizes: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  methods: {
    handleSizeChange(newSize) {
      this.$emit('sizeChange', newSize)
    },
    handleCurrentChange(newNum) {
      this.$emit('numChange', newNum)
    }
  }
}
</script>

<style scoped>
.el-pagination {
  margin-top: 20px;
}
</style>
