<template><div style="height:100%">
<el-table v-loading="loading" :data="rowData" stripe style="width: 100%" height="600" :default-sort="{prop: 'CreatedAt', order: 'descending'}">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="country">
            <span>{{ props.row.ipInfo.country }}</span>
          </el-form-item>
          <el-form-item label="countryCode">
            <span>{{ props.row.ipInfo.countryCode }}</span>
          </el-form-item>
          <el-form-item label="city">
            <span>{{ props.row.ipInfo.city }}</span>
          </el-form-item>
          <el-form-item label="lat">
            <span>{{ props.row.ipInfo.lat }}</span>
          </el-form-item>
          <el-form-item label="lon">
            <span>{{ props.row.ipInfo.lon }}</span>
          </el-form-item>
          <el-form-item label="org">
            <span>{{ props.row.ipInfo.org }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="pid" prop="pid" width="108px" :sortable="sortable"></el-table-column>
    <el-table-column label="ip" prop="ip" width="120px" :sortable="sortable"></el-table-column>
    <el-table-column label="country" prop="ipInfo.country" width="110px" :sortable="sortable"></el-table-column>
    <el-table-column label="city" prop="ipInfo.city" width="110px" :sortable="sortable"></el-table-column>
    <el-table-column label="org" prop="ipInfo.org" :sortable="sortable"></el-table-column>
    <el-table-column label="CreatedAt" :formatter="formatter" prop="CreatedAt" width="240" :sortable="sortable"></el-table-column>
    <el-table-column label="cmd" prop="cmd" :sortable="sortable" :show-overflow-tooltip="soft"><template slot="header">
        <el-input class="myschtb" v-model="search" size="mini" placeholder="输入关键字搜索" @keypress.stop="tmOsch($event)"/>
      </template></el-table-column>
  </el-table>
  <div class="block"><el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
    :background="sortable"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
  </div></div>
</template>
<style>
.demo-table-expand {
    font-size: 0;
    background-color: #edd8c2;
  }
  .demo-table-expand label {
    width: 90px;
    color: #f31409;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
.el-table {
  height: calc(-30px + 100%) !important;
}
.block{float: right}
.myschtb{width:70% !important}
</style>
<script>
export default {
  name: 'CurConn',
  components: {
  },
  data () {
    return {
      pageSizes: [100, 200, 300, 400],
      pageSize: 100,
      total: 0,
      currentPage4: 1,
      loading: true,
      sortable: true,
      soft: true,
      search: '',
      searchLst: '',
      searchN: 0,
      rowDataOld: [],
      rowData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    getDate (s) {
      var date = new Date(s)
      var dateStr = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2)
      return dateStr
    },
    formatter (row, column) {
      return this.getDate(row.CreatedAt)
    },
    handleCurrentChange (val) {
      this.currentPage4 = val
      this.getData()
    },
    tmOsch (e) {
      if (e.code === 13) {
        this.rowData = this.rowDataOld.filter(data => !this.search || JSON.stringify(data).toLowerCase().includes(this.search.toLowerCase()))
      }
    },
    getData () {
      this.loading = true
      this.$http.get('/api/v1/cclsts?currentPage=' + this.currentPage4 + '&pageSize=' + this.pageSize).then(function (res) {
        res.data = res.data || {}
        this.rowData = res.data.list || []
        this.total = res.data.count
        this.loading = false
      }, function (res) {
        console.log(res.status)
        this.rowData = []
        this.loading = false
      })
    }
  }
}
</script>
