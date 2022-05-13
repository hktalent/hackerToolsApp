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
  { urls: 'stun:stun.syncthing.net:3478' },
  { urls: 'turn:104.224.169.71:80?transport=udp', username: 'turn server', credential: 'hieKedq' },
  { urls: 'turn:numb.viagenie.ca', username: 'louis@mozilla.com', credential: 'webrtcdemo' },
  { urls: 'stun:stun.12connect.com:3478' },
  { urls: 'stun:stun.12voip.com:3478' },
  { urls: 'stun:stun1.faktortel.com.au:3478' },
  { urls: 'stun:stun.1und1.de:3478' },
  { urls: 'stun:stun.3clogic.com:3478' },
  { urls: 'stun:stun.3cx.com:3478' },
  { urls: 'stun:stun.aa.net.uk:3478' },
  { urls: 'stun:stun.acrobits.cz:3478' },
  { urls: 'stun:stun.actionvoip.com:3478' },
  { urls: 'stun:stun.advfn.com:3478' },
  { urls: 'stun:stun.aeta-audio.com:3478' },
  { urls: 'stun:stun.aeta.com:3478' },
  { urls: 'stun:stun.a-mm.tv:3478' },
  { urls: 'stun:stun.antisip.com:3478' },
  { urls: 'stun:stun.avigora.com:3478' },
  { urls: 'stun:stun.avigora.fr:3478' },
  { urls: 'stun:stun.b2b2c.ca:3478' },
  { urls: 'stun:stun.bahnhof.net:3478' },
  { urls: 'stun:stun.barracuda.com:3478' },
  { urls: 'stun:stun.bluesip.net:3478' },
  { urls: 'stun:stun.sipgate.net:3478' },
  { urls: 'stun:stun.botonakis.com:3478' },
  { urls: 'stun:stun.budgetsip.com:3478' },
  { urls: 'stun:stun.cablenet-as.net:3478' },
  { urls: 'stun:stun.callromania.ro:3478' },
  { urls: 'stun:stun.callwithus.com:3478' },
  { urls: 'stun:stun.internetcalls.com:3478' },
  { urls: 'stun:stun.cheapvoip.com:3478' },
  { urls: 'stun:stun.cloopen.com:3478' },
  { urls: 'stun:stun.commpeak.com:3478' },
  { urls: 'stun:stun.comtube.com:3478' },
  { urls: 'stun:stun.comtube.ru:3478' },
  { urls: 'stun:stun.cope.es:3478' },
  { urls: 'stun:stun.counterpath.com:3478' },
  { urls: 'stun:stun.ideasip.com:3478' },
  { urls: 'stun:stun.counterpath.net:3478' },
  { urls: 'stun:stun.dcalling.de:3478' },
  { urls: 'stun:stun.demos.ru:3478' },
  { urls: 'stun:stun.dus.net:3478' },
  { urls: 'stun:stun.easycall.pl:3478' },
  { urls: 'stun:stun.easyvoip.com:3478' },
  { urls: 'stun:stun.ekiga.net:3478' },
  { urls: 'stun:stun.epygi.com:3478' },
  { urls: 'stun:stun.etoilediese.fr:3478' },
  { urls: 'stun:stun.faktortel.com.au:3478' },
  { urls: 'stun:stun.freecall.com:3478' },
  { urls: 'stun:stun.freeswitch.org:3478' },
  { urls: 'stun:stun.freevoipdeal.com:3478' },
  { urls: 'stun:stun.gmx.de:3478' },
  { urls: 'stun:stun.gmx.net:3478' },
  { urls: 'stun:stun.halonet.pl:3478' },
  { urls: 'stun:stun.hoiio.com:3478' },
  { urls: 'stun:stun.ipshka.com:3478' },
  { urls: 'stun:stun.it1.hr:3478' },
  { urls: 'stun:stun.ivao.aero:3478' },
  { urls: 'stun:stun.jumblo.com:3478' },
  { urls: 'stun:stun.justvoip.com:3478' },
  { urls: 'stun:stun.linphone.org:3478' },
  { urls: 'stun:stun.liveo.fr:3478' },
  { urls: 'stun:stun.lowratevoip.com:3478' },
  { urls: 'stun:stun.lundimatin.fr:3478' },
  { urls: 'stun:stun.mit.de:3478' },
  { urls: 'stun:stun.miwifi.com:3478' },
  { urls: 'stun:stun.modulus.gr:3478' },
  { urls: 'stun:stun.myvoiptraffic.com:3478' },
  { urls: 'stun:stun.mywatson.it:3478' },
  { urls: 'stun:stun.netappel.com:3478' },
  { urls: 'stun:stun.nfon.net:3478' },
  { urls: 'stun:stun.nonoh.net:3478' },
  { urls: 'stun:stun.nottingham.ac.uk:3478' },
  { urls: 'stun:stun.nova.is:3478' },
  { urls: 'stun:stun.ooma.com:3478' },
  { urls: 'stun:stun.ozekiphone.com:3478' },
  { urls: 'stun:stun.personal-voip.de:3478' },
  { urls: 'stun:stun.phone.com:3478' },
  { urls: 'stun:stun.pjsip.org:3478' },
  { urls: 'stun:stun.poivy.com:3478' },
  { urls: 'stun:stun.powervoip.com:3478' },
  { urls: 'stun:stun.ppdi.com:3478' },
  { urls: 'stun:stun.rackco.com:3478' },
  { urls: 'stun:stun.rockenstein.de:3478' },
  { urls: 'stun:stun.rolmail.net:3478' },
  { urls: 'stun:stun.rynga.com:3478' },
  { urls: 'stun:stun.schlund.de:3478' },
  { urls: 'stun:stun.sigmavoip.com:3478' },
  { urls: 'stun:stun.sipdiscount.com:3478' },
  { urls: 'stun:stun.sipgate.net:10000' },
  { urls: 'stun:stun.sipnet.ru:3478' },
  { urls: 'stun:stun.siportal.it:3478' },
  { urls: 'stun:stun.siptraffic.com:3478' },
  { urls: 'stun:stun.sip.us:3478' },
  { urls: 'stun:stun.telbo.com:3478' },
  { urls: 'stun:stun.tel.lu:3478' },
  { urls: 'stun:stun.tng.de:3478' },
  { urls: 'stun:stun.t-online.de:3478' },
  { urls: 'stun:stun.twt.it:3478' },
  { urls: 'stun:stun.uls.co.za:3478' },
  { urls: 'stun:stun.usfamily.net:3478' },
  { urls: 'stun:stun.vipgroup.net:3478' },
  { urls: 'stun:stun.viva.gr:3478' },
  { urls: 'stun:stun.vivox.com:3478' },
  { urls: 'stun:stun.voicetrading.com:3478' },
  { urls: 'stun:stun.voip.aebc.com:3478' },
  { urls: 'stun:stun.voiparound.com:3478' },
  { urls: 'stun:stun.voip.blackberry.com:3478' },
  { urls: 'stun:stun.voipblast.com:3478' },
  { urls: 'stun:stun.voipbuster.com:3478' },
  { urls: 'stun:stun.voipbusterpro.com:3478' },
  { urls: 'stun:stun.voipcheap.com:3478' },
  { urls: 'stun:stun.voipcheap.co.uk:3478' },
  { urls: 'stun:stun.voip.eutelia.it:3478' },
  { urls: 'stun:stun.voipfibre.com:3478' },
  { urls: 'stun:stun.voipgain.com:3478' },
  { urls: 'stun:stun.voipgate.com:3478' },
  { urls: 'stun:stun.voipinfocenter.com:3478' },
  { urls: 'stun:stun.voippro.com:3478' },
  { urls: 'stun:stun.voipraider.com:3478' },
  { urls: 'stun:stun.voipstunt.com:3478' },
  { urls: 'stun:stun.voipwise.com:3478' },
  { urls: 'stun:stun.voipzoom.com:3478' },
  { urls: 'stun:stun.vo.lu:3478' },
  { urls: 'stun:stun.voxgratia.org:3478' },
  { urls: 'stun:stun.voxox.com:3478' },
  { urls: 'stun:stun.voys.nl:3478' },
  { urls: 'stun:stun.voztele.com:3478' },
  { urls: 'stun:stun.webcalldirect.com:3478' },
  { urls: 'stun:stun.wifirst.net:3478' },
  { urls: 'stun:stun.xten.com' },
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun.xtratelecom.es:3478' },
  { urls: 'stun:stun.51pwn.com:3478', credential: 'Hktalent3135773', username: '51pwn' },
  { urls: 'stun:stun.zadarma.com:3478' }]
function getUserIP (onNewIP) {
  var MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  var pc = new MyPeerConnection({ iceServers: ICE_SERVERS }, { optional: [{ DtlsSrtpKeyAgreement: true }] })
  var noop = function () { }
  var localIPs = {}
  var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
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
    var szUips = ''
    getUserIP(function (ip) {
      if (ip.indexOf('0.0.0.0') === -1) {
        szUips += ip + '; '
      }
      if (szUips) {
        document.getElementById('yid').innerHTML = 'Your Ips:' + szUips
      }
    })
  }
}
</script>
