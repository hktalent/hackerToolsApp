<template><el-main>
  <iframe ref="myIfrm1" v-if="ifIframe" class="ifrm"></iframe></el-main>
</template>

<script>
export default {
  name: 'seeuMap',
  data () {
    return {
      ifIframe: true,
      publicPath: process.env.BASE_URL
    }
  },
  mounted () {
    this.$refs.myIfrm1.src = './seeU.html'
  }
}

</script>
<style lang="less">
.ifrm{
border:0;
margin: 0;
padding: 0;
width:100%;
height: calc(100%);
}
</style>
