<template>
  <el-tabs v-model="activeName" tab-position="right" >
    <el-tab-pane label="Git" name="git">
      <el-table  :data="rowData" stripe style="width: 100%" height="600" :default-sort="{prop: 'CreatedAt', order: 'descending'}" :cell-style="cellStyle">
      <el-table-column label="id" width="170"><template #default="scope">
       <el-popover
    placement="top-start"
    :title="scope.row.summary + ' (' + scope.row.CVEId +')'"
    :width="900"
    trigger="hover"
    :content="scope.row.details"
  >
        <template #reference>
        <a :href="'https://github.com/advisories/'+scope.row.id" target="_blank">{{ scope.row.CVEId }}</a></template></el-popover>
      </template></el-table-column>
      <el-table-column label="summary" prop="summary"></el-table-column>
      <el-table-column label="modified" prop="modified" width="140"></el-table-column>
      <el-table-column label="published" prop="published" width="140"></el-table-column>
      <el-table-column label="severity" prop="database_specific.severity" width="90"></el-table-column>
    </el-table><div class="myipt">
    <input type="text" value="(database_specific.github_reviewed:true) AND (database_specific.severity:HIGHT OR database_specific.severity:CRITICAL)" ref="query" @change="getEsData" style="width:400px">
    <input type="text" value="10" ref="subDay" @change="getEsData" title="多少天以内" style="width:30px">
    </div>
    <div class="block">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
    :background="sortable"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
  </div>
    </el-tab-pane>
    <el-tab-pane label="Google">Google</el-tab-pane>
    <el-tab-pane label="Twitter">Twitter</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>
<style>
.myipt{width:440px;float:left}
.myipt input{line-height:25px;size:13pt}

</style>
<script>
// http://127.0.0.1:9200/intelligence_index/_search?q=(database_specific.github_reviewed:true) AND (database_specific.severity:HIGHT OR database_specific.severity:CRITICAL)&sort=modified:desc&pretty=true&track_total_hits=true
// http://127.0.0.1:9200/intelligence_index/_count?q=(database_specific.github_reviewed:true)%20AND%20(database_specific.severity:CRITICAL)
export default {
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
      activeName: 'git',
      rowData: []
    }
  },
  methods: {
    getDate (s, o) {
      const date = o || new Date(s)
      const dateStr = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2)
      return dateStr
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      const cl = { CRITICAL: '#7a0c04', HIGH: '#fa1505', MODERATE: '#fa7705', LOW: '#b4b8b5' }
      if (column.property === 'database_specific.severity') {
        return { background: cl[row.database_specific.severity], color: '#fff' }
      }
      if (column.property === 'modified' && row.modified && (new Date().getTime() - new Date(row.modified_old).getTime()) < (3600 * 24 * 10000)) {
        return { background: '#a4d0f5', color: '#000' }
      }
      // if (o.database_specific.severity === 'CRITICAL')
    },
    handleCurrentChange (val) {
      this.currentPage4 = val
      this.getEsData()
    },
    handleSizeChange (val) {
      this.currentPage4 = 1
      this.pageSize = val
      this.getEsData()
    },
    async getEsData () {
      this.rowData = []
      const q = this.$refs.query.value
      const oDt = new Date()
      oDt.setTime(new Date().getTime() - 3600 * 24 * 1000 * this.$refs.subDay.value)
      const response = await fetch('http://127.0.0.1:9200/intelligence_index/_search?q=' + q + '&sort=modified:desc&pretty=true&track_total_hits=true', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.currentPage4 - 1,
          size: this.pageSize,
          query: {
            range: {
              modified: {
                gte: oDt.toISOString(), // toISOString, toUTCString
                lte: new Date().toISOString(), // toLocaleString
                format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis||strict_date_time_no_millis'
              }
            }
          }
        })
      })
      const data = JSON.parse(await response.text())
      this.total = data.hits.total.value
      const x = data.hits.hits
      for (let i = 0; i < x.length; i++) {
        x[i] = x[i]._source
        x[i].modified_old = x[i].modified
        x[i].published = this.getDate(x[i].published)
        x[i].modified = this.getDate(x[i].modified)
        x[i].CVEId = x[i].id
        // x[i].details = x[i].details.replace(/\r?\n/gmi, '<br>')
        if (x[i].aliases && x[i].aliases.length > 0) {
          x[i].CVEId = x[i].aliases[0] || x[i].id
        }
      }
      // console.log(x)
      this.rowData = x
    }
  },
  mounted () {
    this.getEsData()
  }
}
</script>
