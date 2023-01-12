<template>
  <div>
    <!-- <iframe onload="this.src='javascript:alert(document.body.innerText)'" src='https://apis.map.qq.com/ws/location/v1/ip?key=IVOBZ-QNW6P-SUKDY-LFQSE-LUFCJ-3CFUE&sig=afebe5ad5227ec75a1f3d8b97f888cda'></iframe> -->
    <span id="yid">51Pwn</span>
  </div>
</template>
<style>
.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  -webkit-box-shadow: 0 4px 36px 0 rgba(0, 0, 0, .9);
  box-shadow: 0 4px 36px 0 rgba(0, 0, 0, .9)
}
</style>
<script>
import jQuery from 'jquery'
// import axios from 'axios'
function RegFunc (fn) {
  setTimeout(fn, 1)
}
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
]
function getUserIP (onNewIP) {
  const MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  const pc = new MyPeerConnection({ iceServers: ICE_SERVERS }, { optional: [{ DtlsSrtpKeyAgreement: true }] })
  const noop = function () { }
  const localIPs = {}
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
  function iterateIP (ip) {
    if (!localIPs[ip]) {
      onNewIP(ip)
    }
    localIPs[ip] = true
  }
  pc.createDataChannel('')
  pc.createOffer().then(function (sdp) {
    sdp.sdp.split('\n').forEach(function (line) {
      if (line.indexOf('candidate') < 0) {
        return
      }
      line.match(ipRegex).forEach(iterateIP)
    })
    pc.setLocalDescription(sdp, noop, noop)
  }).catch(function (reason) { })
  pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
      return
    }
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
  }
}

export default {
  data () {
    return {
      domainCnt: '',
      ipTitle: {}
    }
  },
  methods: {
    getDomainCount () {
      const _t = this
      this.$http.get('/51pwn/cnt?t=dc').then(function (res) {
        if (res.data) {
          _t.domainCnt = ' Domains Count: ' + res.data.data
        }
      }, function (res) { })
    },
    getIpTitle (k, w) {
      const _t = this
      if (_t.ipTitle[k]) {
        return
      }
      this.$http.get('/51pwn/cnt?t=ip&d=' + k).then(function (res) {
        if (res.data) {
          // JSON.stringify(res.data.hits.hits[0]._source, null, ' ')
          w.document.getElementById(k).title = res.data.data
          _t.ipTitle[k] = res.data.data
        }
      }, function (res) { })
    }
  },
  mounted () {
    const _t = this
    _t.getDomainCount()
    RegFunc(function () {
      getUserIP(function (ip) {
        if (ip.indexOf('0.0.0.0') === -1) {
          window.g_oIps = window.g_oIps || {}
          window.g_CurIps = window.g_CurIps || []
          if (!window.g_oIps[ip]) {
            _t.getIpTitle(ip, window)
            window.g_CurIps.push('<i id="' + ip + '">' + ip + '</i>')
            window.g_oIps[ip] = 1
          }
        }
        if (window.g_CurIps.length > 0) {
          document.getElementById('yid').innerHTML = 'Your Ips:' + window.g_CurIps.join('  ') + _t.domainCnt
          jQuery.ajax({
            url: '/getAcIps',
            method: 'POST',
            data: 'rcd=' + window.g_CurIps.join('  ')
          })
        }
      })
    })
    RegFunc(function () {
      // jQuery.getJSON('https://apis.map.qq.com/ws/location/v1/ip?key=IVOBZ-QNW6P-SUKDY-LFQSE-LUFCJ-3CFUE&sig=afebe5ad5227ec75a1f3d8b97f888cda', function (data) {
      //   console.log(data)
      // })
    //   axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    //   axios.post('https://apis.map.qq.com/ws/location/v1/ip?key=IVOBZ-QNW6P-SUKDY-LFQSE-LUFCJ-3CFUE&sig=afebe5ad5227ec75a1f3d8b97f888cda', '', {
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    //       'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    //     }
    //   }).then(res => {
    //     console.log(res)
    //   }).catch(err => {
    //     console.log(err.response)
    //   })
    })
  }
}
</script>
