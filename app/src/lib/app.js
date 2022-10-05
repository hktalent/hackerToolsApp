import myjs from './myjs'
import html2canvas from 'html2canvas'
import { io } from 'socket.io-client'

/* eslint-disable */
export default {
  components: {
  },
  name: 'app',
  runtimeCompiler: true,
  bLoad: false,
  mounted () {
    if(!this.bLoad) {
      this.getRmtData()
    }
    this.bLoad = true
  },
  provide () {
    return {
      getRmtData: this.getRmtData
    }
  },
  data () {
    return {
      tabPosition: 'right',
      activeName: 'tb01',
      ifrmSrc: '',
      aRmtTagss: [],
      rmcnlb: 'Remote Connection',
      ncctt: 'Network Connection',
      aRmtSvsLists: [ ],
      fullScreen: false,
      wdwidth:"100px",
      isCollapse: true,
      activeIndex2: '/#',
      value: '',
      drawer: false,
      direction: 'rtl',
      oStopFlg: {},
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    webskt () {
      let socket = io("./ws")
    },
    fnDuplicate (szId) {
      for ( let x = 0; x < this.aRmtSvsLists.length; x++ ) {
        if( this.aRmtSvsLists[x].id === szId) {
          let x0 = JSON.parse(JSON.stringify(this.aRmtSvsLists[x]))
          x0.id = x0.id + "*" + new Date().getTime()
          this.aRmtSvsLists.push(x0)
          break
        }
      }
    },
    fnNcc () {
      curCC.click()
    },
    fnEdit (x) {
      this.activeName = 'RMCm1'
      this.$router.push({name: 'home', replace: true}).catch(err => {})
      this.$router.push({name: 'sshRmt', replace: true,params: { id:x }}).catch(err => {})
    },
    fnSt1 (x) {
      if (x.$el.id === 'pane-tb02') {
        this.fnMyClkRt('SubDomain')
      }
      if (x.$el.id === 'pane-RMCm1' && this.$route.name !== 'sshRmt') {
        if(this.sshrmtParm){
          this.$router.push({name: 'sshRmt',params: this.sshrmtParm, replace: true}).catch(err => {})
          this.sshrmtParm = null
        } else {
          this.$router.push({name: 'sshRmt', replace: true}).catch(err => {})
        }
      }
    },
    fnSt () {
      window['tab-RMCm1'].click()
    },
    upCntTags (a) {
      let oT = {}
      for (let i = 0; i < a.length; i++) {
        if(a[i].tags) {
          let x = a[i].tags.split(/[,;]/)
          for (let j = 0; j < x.length; j++) {
            if (!oT[x[j]]) {
              oT[x[j]] = 0
            }
            oT[x[j]] += 1
          }
        }
      }
      let s1 = ""
      this.aRmtTagss = [ { tag:'all', cnt:a.length } ]
      for (var k in oT) {
        this.aRmtTagss.push( { tag:k, cnt:oT[k] } )
      }
    },
    filterMyCard(tag) {
      if ('all' == tag) {
        this.aRmtSvsLists = this.aRmtSvsListsOld
        return
      }
      this.aRmtSvsListsOld = this.aRmtSvsListsOld || this.aRmtSvsLists
      let a = this.aRmtSvsListsOld
      let a1 = []
      for (let i = 0; i < a.length; i++) {
        if(-1 < a[i].tags.indexOf(tag)) {
          a1.push(a[i])
        }
      }
      this.aRmtSvsLists = a1
    },
    getRmtData () {
      this.$http.get('/api/v1/rmtsvlists').then(function(res) {
        this.aRmtSvsLists = res.data
        this.upCntTags(res.data)
        this.rmcnlb = 'Remote Connection('+res.data.length+')'
      },function(res){})
    },
    saveImg (o, o1,x1) {
        if("IFRAME" !== o1.tagName || !o1.src) {
          return
        }
        const xD = o1.contentWindow.document, xHo = xD.body, xx01 = xD.querySelector('div.xterm-screen'),_t = this
        _t.imgData = _t.imgData || {}
        if(xx01) {
        this.oStopFlg[x1] = window.setInterval(function() {
          html2canvas(xHo, {allowTaint: true, useCORS: true}).then(function(canvas) {
            var x99 =  canvas.toDataURL("image/webp", 0.6)
            if (x99 !== _t.imgData[x1])
            {
              _t.imgData[x1] = x99
              o.$http.post('/api/v1/rmtsvImg',{'imgData':x99,'id': x1})
              _t.upImgData(x1, x99)
              if( _t.imgData != _t.imgData )_t.imgData = _t.imgData
            }
          })
        },1000)
      }
    },
    autoSaveImg (e,x1) {
      if(html2canvas && e) {
        this.saveImg(this, e.currentTarget || e.target,x1)
      }
    },
    handleCommand (command) {
      if (-1 < String(command).indexOf('/conn/')) {
        let bHv = false
        let szId = command.split('/')[2]
        for ( let x = 0; x < this.aRmtSvsLists.length; x++ ) {
          if( (this.aRmtSvsLists[x].id + '') === szId) {
            bHv = true
            break
          }
        }
        if(false === bHv) {
          this.aRmtSvsLists.push( { 'id': szId, 'title': document.activeElement.innerText })
        }
        document.getElementById('img' + szId).style.display = 'none'
        let oIfrm = document.getElementById('ifrm' + szId)
        oIfrm.style.display = ''
        oIfrm.src = command
      }
    },
    handleClose1 (done) {
      done()
    },
    disconnect (e, x1) {
      let o1 = document.getElementById('ifrm' + x1)
      o1.style.display = 'none'
      document.getElementById('img' + x1).style.display = ''
      o1 = o1.contentWindow.document.getElementById('disconnectID')
      if(o1)o1.click()
      clearInterval(this.oStopFlg[x1])
    },
    upImgData (x1,d) {
      for( let i = 0; i < this.aRmtSvsLists.length; i++) {
        if( x1 === this.aRmtSvsLists[i].id )
        {
          this.aRmtSvsLists[i].imgData = d
          break
        }
      }
    },
    fnMyClkRt (s) {
      this.activeName = 'tb02'
      if (this.$route.name !== s) {
        this.$router.push({name: s, replace: true}).catch(err => {})
      }
    },
    fnMinWin (e) {
      myjs.fnMinWin(e.target.parentNode.parentNode.parentNode.parentNode, document)
    },
    fnMaxWin (e) {
      myjs.fnMaxWin(e.target.parentNode.parentNode.parentNode.parentNode)
    },
    fnFsc (e) {
      myjs.fnFullScreen(e.target.parentNode.parentNode.parentNode)
    },
    handleOpen (key, keyPath) {
      this.isCollapse = !this.isCollapse
    },
    handleClose (key, keyPath) {
    }
  }
}
