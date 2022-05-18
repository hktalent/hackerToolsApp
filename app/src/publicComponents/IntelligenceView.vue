<template>
  <el-tabs v-model="activeName" tab-position="right" >
    <el-tab-pane label="Git" name="git">
    </el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>
<style>
.box-card{width:100%;height:90%;}
.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  -webkit-box-shadow: 0 4px 36px 0 rgba(0, 0, 0, .9);
  box-shadow: 0 4px 36px 0 rgba(0, 0, 0, .9)
}
</style>
<script>
export default {
  data () {
    return {
      activeName: 'git'
    }
  },
  mounted () {
  }
}
</script>
