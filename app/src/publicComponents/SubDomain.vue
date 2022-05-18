<template>
  <el-form ref="form">
    <el-row>
      <el-col :span="12">
        <el-input size="small" type="textarea" placeholder="please input Domains" :autosize="{ minRows: 8, maxRows: 15}" v-model="form.domains"><template
            slot="prepend">Domains:</template></el-input>
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
  </el-form>
</template>
<style>
</style>
<script>
export default {
  name: 'SubDomain',
  components: {
  },
  data () {
    return {
      form: {
        domains: ''
      }
    }
  },
  methods: {
    getData (s) {
    }
  },
  created () {
    this.getData()
  }
}
</script>
