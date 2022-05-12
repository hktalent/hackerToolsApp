<template>
  <el-card class="box-card">
    <el-form ref="form">
      <el-row>
        <el-col :span="12">
          <el-input  size="small" v-model="form.localIp"><template slot="prepend">LocalIp:</template></el-input>
        </el-col>
        <el-col :span="12">
        <el-input  size="small" v-model="form.publicIp"><template slot="prepend">Public IP:</template></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input size="small" placeholder="please input VPS IP" v-model="form.vpsIp"><template slot="prepend">VPS IP:</template></el-input>
        </el-col>
        <el-col :span="12">
          <el-input  size="small" placeholder="please input VPS port" v-model.number="form.Vpsport"><template slot="prepend">Vps Port:</template></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label-width="0">
          <el-button type="primary" round elevation="19" @click="saveSshConfig" ref="r7">保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
</template>
<style>
.el-form-item {
  text-align: center;
  padding-top: 20px;
}

.vue-tags-input,.ti-input{max-width:none !important}
.el-row {
  margin:8px 0 8px 0;
}
.myTat textarea{
  height:calc(-440px + 100vh) !important;
}
</style>
<script>
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  inject: ['getRmtData'],
  components: {
  },
  data () {
    return {
      tags: [],
      lstId: '',
      form: {
        localIp: '',
        publicIp: '',
        vpsIp: '',
        vpsPort: ''
      }
    }
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    saveSshConfig () {
      const aT = []
      for (let i = 0; i < this.tags.length; i++) {
        aT.push(this.tags[i].text)
      }
      this.form.tags = aT.join(';')
      axios.post('/api/v1/rsc', this.form).then(resp => {
        if (resp.data.code > 0) {
          Message.success('save msg: ' + resp.data.msg)
          this.getRmtData()
        } else {
          Message.info('save error: ' + resp.data.msg)
        }
        return 0
      }
      ).catch(function (error) {
        alert(error)
      }
      )
    }
  }
}
</script>
