<template>
  <VueOkrTree
  :data="testData"
  :left-data="testLeftData"
  only-both-tree
  direction="horizontal"
  show-collapsable
  node-key="id"
  default-expand-all
  @node-click="handleNodeClick"
  @node-contextmenu="handleCoxMenu"
  @node-expand="handleNodeExpand"
  @node-collapse="handleNodeCollapse"/>
</template>

<script>
import { VueOkrTree } from 'vue-okr-tree'
import 'vue-okr-tree/dist/vue-okr-tree.css'

export default {
  name: 'TargetMap',
  components: {
    VueOkrTree
  },
  data () {
    return {
      testData: [{
        id: 1,
        label: 'xxx科技有有限公司',
        children: [{
          id: 2,
          label: '产品研发部',
          children: [{
            id: 3,
            label: '研发-前端'
          }, {
            id: 4,
            label: '研发-后端'
          }, {
            id: 5,
            label: 'UI 设计'
          }]
        }, {
          id: 6,
          label: '销售部',
          children: [{
            id: 7,
            label: '销售一部'
          },
          {
            id: 8,
            label: '销售二部'
          }]
        },
        {
          id: 9,
          label: '财务部'
        }]
      }],
      testLeftData: [{
        id: 1,
        label: 'xxx科技有有限公司',
        children: [{
          id: 12,
          label: '(左)产品研发部',
          children: [{
            id: 13,
            label: '(左)研发-前端'
          }, {
            id: 14,
            label: '(左)研发-后端'
          }, {
            id: 15,
            label: '(左)UI 设计'
          }]
        }, {
          id: 16,
          label: '(左)销售部',
          children: [{
            id: 17,
            label: '(左)销售一部'
          },
          {
            id: 18,
            label: '(左)销售二部'
          }]
        },
        {
          id: 19,
          label: '(左)财务部'
        }]
      }]
    }
  },
  methods: {
    handleNodeClick (data) {
      alert(`我是${data.label},我被点击了`)
    },
    handleCoxMenu (event, data) {
      alert(`我是${data.label},我的右键被点击了`)
    },
    handleNodeExpand (data) {
      alert(`我是${data.label},我被展开了`)
    },
    handleNodeCollapse (data) {
      alert(`我是${data.label},我被收起了`)
    }
  }
}
</script>
<style scoped lang="less">
#myCanvas {height:100%;width:100%;}
</style>
