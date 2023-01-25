<template><iframe :src="ifrmSrc" @load="fnSetIp()" id="hktifrm"></iframe></template>

<script>
// @ is an alias to /src
export default {
  data () {
    return {
      ifrmSrc: '/' + (this.$route.meta.toSrc || '') + '/'
    }
  },
  name: 'HackTools',
  components: {
  },
  methods: {
    fnSetIp () {
      if (window.g_CurIps) {
        let o = document.getElementById('hktifrm').contentWindow.document.getElementsByTagName('input')
        if (o.length > 0) {
          o = o[0]
          if (o) {
            o.value = window.g_CurIps[0] || ''
          }
        }
      }
    }
  }
}
</script>
<style>
iframe {
border:0;
margin: 0;
padding: 0;
width:100%;
height: calc(100%);
}
</style>
