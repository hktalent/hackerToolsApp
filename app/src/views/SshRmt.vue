<template>
  <el-card class="box-card">
    <el-form ref="form">
      <el-row>
        <el-col :span="12">
          <el-input  size="small" placeholder="please input  name" v-model="form.title"><template slot="prepend">Title:</template></el-input>
        </el-col>
        <el-col :span="12">
        <vue-tags-input v-model="form.tags" :tags="tags" @tags-changed="newTags => tags = newTags"><template slot="prepend">Tags:</template></vue-tags-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input  size="small" placeholder="please input IP or Domain name" v-model="form.ip"><template slot="prepend">IP or Domain name:</template></el-input>
        </el-col>
        <el-col :span="12">
          <el-input  size="small" placeholder="please input port" v-model.number="form.port"><template slot="prepend">Port:</template></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input  size="small" placeholder="please input user name" v-model="form.user"><template slot="prepend">UserName:</template></el-input>
        </el-col>
        <el-col :span="12">
          <el-input  size="small" placeholder="please input password" type="password" v-model="form.p5wd"><template slot="prepend">Password:</template></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input class="myTat" size="small" type="textarea" :autosize="{ minRows: 8, maxRows: 15}" placeholder="please input user Key or windows domain name" v-model="form.key"></el-input>
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
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  inject: ['getRmtData'],
  components: {
    VueTagsInput
  },
  data () {
    return {
      tags: [],
      lstId: '',
      form: {
        title: '',
        tags: '',
        ip: '',
        port: 22,
        user: '',
        p5wd: '',
        key: ''
      }
    }
  },
  mounted () {
  },
  watch: {
    '$route.params': {
      handler: function (x) {
        if (this.$route.params.id && this.$route.params.id !== this.lstId) {
          this.lstId = this.$route.params.id
          axios.get('/api/v1/rsc/s/' + this.$route.params.id).then(resp => {
            this.form = resp.data
          }).catch(function (error) {
            alert(error)
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    focusNext (nextRef) {
      this.$refs[nextRef].focus()
    },
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
