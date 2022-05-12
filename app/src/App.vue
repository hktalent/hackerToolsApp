<template>
  <div id="app">
    <el-container>
      <el-header background="trasla">
        <el-menu ref="menu" router :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleCommand" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="/">Home</el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="icon-fixed-width icon-cogs icon-1x"></i>RemoteConfig</template>
             <el-submenu index="1-4">
              <template slot="title"><router-link to="/sshrmt"><div class="sshrmt" @click="fnSt" id="addId">+add</div></router-link>
              </template>
              <el-menu-item v-for="(item) in aRmtSvsLists" :key="item.id" :id="'cdId'+item.id" :label="item.title" :name="item.id" :index="'/conn/'+item.id">{{item.title}}</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="/about">About</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="70px">
          <el-scrollbar class="myscrollbar">
            <el-menu default-active="2-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
              <el-menu-item index="1" @click="handleOpen">
                <i class="el-icon-right-open"></i><span slot="title">打开菜单导航</span>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span slot="title">导航一</span>
                </template>
                <el-menu-item-group>
                  <span slot="title">分组一</span>
                  <el-menu-item index="2-1">选项1</el-menu-item>
                  <el-menu-item index="2-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="2-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="2-4">
                  <span slot="title">选项4</span>
                  <el-menu-item index="2-4-1">选项1</el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-menu-item index="3">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>
              <el-menu-item index="4" disabled>
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
              </el-menu-item>
              <el-menu-item index="5">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main style="height:calc(-100px + 100vh)">
          <el-tabs type="border-card" style="height:100%;flex-grow:1;" @tab-click="fnSt1">
            <el-tab-pane :label="rmcnlb" class="myPaneCard" effect="dark">
    <el-card shadow="hover" v-for="(item) in aRmtSvsLists" :key="item.id" :id="'cdId'+item.id" :label="item.title" :name="item.id" :rmtHref="'/conn/'+item.id">
    <a href="#" @click="'#'+item.id">
    <div class="winCtrl"><i id="fltMneu">{{item.title}}</i>  <i class="icon-plus" title="Duplicate a window so that multiple windows open a target server" @click="fnDuplicate(item.id)"></i><i class="icon-cog" title="config" @click="fnEdit(item.id)"></i><i class="icon-eye-close" title="Disconnect" @click="disconnect($event,item.id)"></i><i class="icon-mail-reply" title="back to view" @click="fnMinWin"></i><i class="icon-external-link-sign" title="max window" @click="fnMaxWin"></i><i @click="fnFsc" class="icon-fullscreen" title="fullscreen"></i></div>
    <div class="myImg" :id="'img' + item.id" :idDt="item.id" @click="handleCommand('/conn/'+item.id)" title="This is the most recent view, click to start connecting"><img :src="item.imgData"></div>
    <i class="clearfix"></i>
    <iframe src="" class="ifrm" @load="autoSaveImg($event,item.id)" :id="'ifrm' + item.id"></iframe></a>
    </el-card>
  </el-tab-pane><el-tab-pane label="Remoute Config Manager" class="cfgrmt" name="RMCm1">
            <router-view></router-view></el-tab-pane>
            <el-tab-pane :label="ncctt" name="curConn">
            <keep-alive><router-view name="curconn"></router-view></keep-alive></el-tab-pane>
            <el-tab-pane label="WorkSpance">
            <router-view name="cmwork"></router-view></el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
      <el-footer><FooterComp></FooterComp></el-footer>
    </el-container>
  </div>
</template>
<script>
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
      rmcnlb: '',
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
      let socket = io("./ws");
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
      curCC.click();
    },
    fnEdit (x) {
      this.$router.push({name: 'sshrmt'}).catch(err => {})
      let _t = this
      setTimeout(() => {
        _t.$router.push({'name': 'home'}).catch(err => {})
        _t.sshrmtParm = {id: x}
        _t.fnSt()
      },33)
      
    },
    fnSt1 (x) {
      if (x.$el.id === "pane-RMCm1") {
        if(this.sshrmtParm){
          this.$router.push({name: 'sshrmt',params: this.sshrmtParm}).catch(err => {})
          this.sshrmtParm = null
        } else {
          this.$router.push({name: 'sshrmt'}).catch(err => {})
        }
      }
      if (x.$el.id === "pane-curConn") {
        this.$router.push({path: '/curconn'}).catch(err => {})
      }
    },
    fnSt () {
      window['tab-RMCm1'].click();
    },
    getRmtData () {
      this.$http.get('/api/v1/rmtsvlists').then(function(res) {
        this.aRmtSvsLists = res.data;
        this.rmcnlb = 'Remote Connection('+res.data.length+')'
      },function(res){})
    },
    saveImg (o, o1,x1) {
        if("IFRAME" !== o1.tagName || !o1.src) {
          return
        }
        const xD = o1.contentWindow.document, xHo = xD.body, xx01 = xD.getElementById('terminal-container'),_t = this
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
      this.isCollapse = !this.isCollapse;
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style lang="less">
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
@import url("css/font-awesome.css");

body {
  margin: 0
}
.sshrmt{width:100% !important;background-color:#004344 !important;color:#0ff}
.winCtrl{
  float: right;
  position: relative;
  top:-15px;
}
.myImg img {
  width:100%;
  height:100%;
}
.myImg {
  width:100%;
  height:100%;
  float:left;
  left: 0;
  top: 0;
  position: relative
}

.myPaneCard{
  flex-flow: row wrap;
  justify-content:space-between;
  align-content: flex-start;
  align-items: flex-start;
  display: -webkit-flex;
  display: flex;
}
.myPaneCard .el-card{width:30%;height:240px;margin: 10px;}
.maxWin {
  position: fixed;
  float: left;
  top: 0;
  left: 0;
  padding: 0 !important;
  margin: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index:999999
}

.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    -webkit-box-shadow: 0 4px 36px 0 rgba(0, 0,0, .9);
    box-shadow:0 4px 36px 0 rgba(0, 0,0, .9)
}
.winCtrl i{margin:3px !important;cursor:pointer}
.myPaneCard .ifrm,.myPaneCard img{
border:0;
margin: 0;
padding: 0;
width:100%;
height: calc(-40px + 100%);
}
.el-card__body {
  padding:20px 0 0 0;
  width:100%;
  height:100%
}
.el-header {
  width: 100vw;
  padding: 0;
  padding:0;
}

.el-menu-demo {
  padding-left: 65px
}

.el-drawer {
  z-index: 99999;
  height: calc(-100px + 100vh);
  margin-top: 60px
}

.el-tab-pane{
  height: calc(-198px + 100vh);
  overflow: auto;
  padding:0 !important;
}

.myscrollbar {
  height: 100%;
}

.myscrollbar>.el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>