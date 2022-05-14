<template>
  <div id="yid">
    51Pwn
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

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun.51pwn.com:3478', credential: 'Hktalent3135773', username: '51pwn' }]
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
    }
  },
  mounted () {
    getUserIP(function (ip) {
      if (ip.indexOf('0.0.0.0') === -1) {
        window.g_oIps = window.g_oIps || {}
        window.g_CurIps = window.g_CurIps || []
        if (!window.g_oIps[ip]) {
          window.g_CurIps.push(ip)
          window.g_oIps[ip] = 1
        }
      }
      if (window.g_CurIps.length > 0) {
        document.getElementById('yid').innerHTML = 'Your Ips:' + window.g_CurIps.join('; ')
      }
    })
  }
}
</script>
