<template>
  <butterfly-vue :canvasData="mockData" id="myCanvas" />
</template>

<script>
import { ButterflyVue } from 'butterfly-vue'
import mockData from './mockData.js'

export default {
  components: { ButterflyVue },
  name: 'TargetMap',
  mounted () {
  },
  data () {
    return {
      mockData
    }
  }
}
</script>
<style scoped lang="less">
#myCanvas {height:100%;width:100%;}
</style>
