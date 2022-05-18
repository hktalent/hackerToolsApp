<template>
<el-card class="box-card" shadow="hover"><div ref="myMark">
</div>
<div ref="mdCode" style="display:none">
</div>
</el-card>
</template>
<style>
.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    -webkit-box-shadow: 0 4px 36px 0 rgba(0, 0,0, .9);
    box-shadow:0 4px 36px 0 rgba(0, 0,0, .9)
}
</style>
<script>
import { marked } from 'marked'
// import axios from 'axios'
export default {
  data () {
    return {
    }
  },
  filters: {
    marked: marked
  },
  mounted () {
    this.$refs.myMark.innerHTML = marked.parse(this.$refs.mdCode.innerText)
    // axios.get('/views/test.js', this.form).then(resp => {
    //   this.$refs.myMark.innerHTML = marked.parse(resp.data)
    // }).catch(function (error) {
    //   alert(error)
    // })
  }
}
</script>
