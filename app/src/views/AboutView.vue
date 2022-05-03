<template>
<el-card class="box-card">
  <el-form>
  <el-row><el-form-item label-width="0">
     <el-button>保存</el-button>
  </el-form-item>
  </el-row>
  </el-form></el-card>
</template>
<style>
.el-form-item{
  text-align: center;
  padding-top: 20px;
}
  .el-input {
    height: 40px;
  }
</style>
<script>
export default {
  data () {
    return {
      sshInfo: true,
      input1: '',
      input2: '22',
      input3: 'root',
      input4: '',
      input5: '',
      input6: '',
      input7: 'ip,指纹,经纬度'
    }
  }
}
</script>
