<template>
  <el-form ref="form">
    <el-row>
  <el-col :span="24">
      <vue-tags-input v-model="form.tags" :tags="tags" placeholder="please input Tags"  @tags-changed="newTags => tags = newTags"><template slot="prepend">Tags:</template></vue-tags-input>
      </el-col>
      <el-col :span="24">
        <el-input size="small" type="textarea" @change="loadDomainInfo" placeholder="please input Domains" :autosize="{ minRows: 3, maxRows: 15}" v-model="form.domain"><template slot="prepend">Domains:</template></el-input>
      </el-col>
    </el-row>
    <el-row class="myrow">
        <el-form-item label-width="0">
          <el-button type="primary" round @click="doStart">start</el-button>
          <el-button type="primary" round  @click="SaveDomainLst">save domains</el-button>
        </el-form-item>
      </el-row>
      <el-row class="myrow">
      <el-table
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="label"
    border
    default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="label"
      label="target"
      width="230">
    </el-table-column>
    <el-table-column
      prop="ip"
      label="ip">
    </el-table-column>
  </el-table>
      </el-row>
  </el-form>
</template>
<style>
</style>
<script>
import VueTagsInput from '@johmun/vue-tags-input'
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  name: 'SubDomain',
  components: {
    VueTagsInput
  },
  data () {
    return {
      tableData: [],
      tags: [],
      form: {
        tags: '',
        domain: ''
      }
    }
  },
  methods: {
    cvtIps (a) {
      const x = []
      if (typeof a !== 'string') {
        for (let i = 0; i < a.length; i++) {
          x.push({ label: '', ip: a[i] })
        }
      } else {
        x.push({ label: '', ip: a })
      }
      return x
    },
    cvtDt (a, o, domain) {
      const o1 = { label: domain, children: [] }
      for (let i = 0; i < a.length; i++) {
        if (a[i].domain === domain || a[i].domain.indexOf('.' + domain) > -1) {
          o1.children.push(a[i])
        }
      }
      o1.label += '(' + o1.children.length + ')'
      o.push(o1)
    },
    cvtData (o) {
      if (o.hits && o.hits.hits && o.hits.hits.length > 0) {
        o = o.hits.hits
        for (let i = 0; i < o.length; i++) {
          o[i] = o[i]._source
          o[i].label = o[i].domain + '(' + ((o[i].ip || []).length) + ')'
          o[i].children = this.cvtIps(o[i].ip || [])
          o[i].ip = ''
        }
        let aR = []
        const a1 = this.form.domain.split('\n')
        for (let i = 0; i < a1.length; i++) {
          if (a1[i] !== '') {
            this.cvtDt(o, aR, a1[i])
          }
        }
        if (aR.length > 1)aR = [{ label: 'root', children: aR }]
        this.tableData = aR
      }
    },
    loadDomainInfo () {
      if (this.form.domain) {
        axios.post('/51pwn/gdlists', { dlst: this.form.domain }).then(resp => {
          this.cvtData(resp.data)
          return 0
        }
        ).catch(function (error) {
          alert(error)
        }
        )
      }
    },
    SaveDomainLst () {
      axios.post('/51pwn/dlists', { dlst: this.form.domain }).then(resp => {
        if (resp.data.code > 0) {
          Message.success('save msg: ' + resp.data.msg)
        } else {
          Message.info('save error: ' + resp.data.msg)
        }
        return 0
      }
      ).catch(function (error) {
        alert(error)
      }
      )
    },
    doStart () {
      axios.post('/51pwn/doSubdomian', this.form).then(resp => {
        if (resp.data.code > 0) {
          Message.success('save msg: ' + resp.data.msg)
        } else {
          Message.info('save error: ' + resp.data.msg)
        }
        return 0
      }
      ).catch(function (error) {
        alert(error)
      }
      )
    },
    setTags (szTags) {
      this.tags = szTags.split(/[,;]/)
      this.form.tags = ''
    },
    getData (s) {
    },
    handleNodeClick (data) {
    },
    handleCoxMenu (event, data) {
    },
    handleNodeExpand (data) {
    },
    handleNodeCollapse (data) {
    }
  },
  created () {
    this.getData()
  }
}
</script>
