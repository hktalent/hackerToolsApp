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
    <el-table-column label="org" prop="ipInfo.org" width="110px" :sortable="sortable"></el-table-column>
    <el-table-column label="CreatedAt" prop="CreatedAt" width="240" :sortable="sortable"></el-table-column>
    <el-table-column label="cmd" prop="cmd" :sortable="sortable" :show-overflow-tooltip="soft"><template slot="header">
        <el-input class="myschtb" v-model="search" size="mini" placeholder="输入关键字搜索" @keyup="tmOsch($event)" />
      </template></el-table-column>
  </el-table>
  <div class="block"><el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
    :hide-on-single-page="hosp"
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
  components: {
  },
  data () {
    return {
      pageSizes: [100, 200, 300, 400],
      pageSize: 100,
      total: 400,
      hosp: true,
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
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    tmOsch (e) {
      if (e.code === 13) {
        this.rowData = this.rowDataOld.filter(data => !this.search || JSON.stringify(data).toLowerCase().includes(this.search.toLowerCase()))
      }
    },
    getData () {
      this.$http.get('/api/v1/cclsts').then(function (res) {
        this.rowData = res.data
        this.loading = false
      }, function (res) {
        console.log(res.status)
      })
    }
  }
}
</script>
