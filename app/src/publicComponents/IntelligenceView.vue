<template>
  <el-tabs v-model="activeName" tab-position="right" >
    <el-tab-pane label="Git" name="git">
    </el-tab-pane>
    <el-tab-pane label="Google">Google</el-tab-pane>
    <el-tab-pane label="Twitter">Twitter</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>
<style>
</style>
<script>
// http://127.0.0.1:9200/intelligence_index/_search?q=(database_specific.github_reviewed:true)%20AND%20(database_specific.severity:CRITICAL)&sort=modified:desc&pretty=true&track_total_hits=true
// http://127.0.0.1:9200/intelligence_index/_count?q=(database_specific.github_reviewed:true)%20AND%20(database_specific.severity:CRITICAL)
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
