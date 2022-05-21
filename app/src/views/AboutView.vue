<template>
<el-card class="box-card" shadow="hover"><div ref="myMark" class="myMark">
</div>
</el-card>
</template>
<style>
.myMark{line-height: 1.9em}
</style>
<script>
import { marked } from 'marked'
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.$http.get('/md/test.md').then(resp => {
      this.$refs.myMark.innerHTML = marked.parse(resp.body)
    })
  }
}
</script>
