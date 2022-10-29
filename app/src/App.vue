<template>
  <div id="app">
    <el-container>
      <el-header background="trasla">
        <el-menu
          ref="menu"
          router
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleCommand"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/sshRmt" @click="fnSt">Config</el-menu-item>
          <el-menu-item index="/">About</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="70px">
          <el-scrollbar class="myscrollbar">
            <el-menu
              default-active="2-4-1"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :collapse="isCollapse"
            >
              <el-menu-item index="1" @click="handleOpen">
                <i class="el-icon-right-open"></i
                ><span slot="title">打开菜单导航</span>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="x1" @click="fnMyClkRt('HackTools')">Hack Tools</el-menu-item>
                  <el-menu-item index="x2" @click="fnMyClkRt('CyberChef')">CyberChef Tools</el-menu-item>
                  <el-menu-item index="x3" @click="fnMyClkRt('TargetMap')">TargetMap</el-menu-item>
                  <el-menu-item index="x4" @click="fnMyClkRt('SubDomain')">SubDomain Scan</el-menu-item>
                  <el-menu-item index="x5" @click="fnMyClkRt('index')">Hacker Search</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <el-tabs v-model="activeName" type="border-card" @tab-click="fnSt1">
            <el-tab-pane label="Scan-4-All"><scan4all></scan4all></el-tab-pane>
            <el-tab-pane
              :label="rmcnlb"
              class="myPaneCard"
              effect="dark"
              name="tb01"
            >
              <div id="CntTags" title="click filter">
                <a
                  href="#"
                  v-for="item in aRmtTagss"
                  :key="item.tag"
                  @click="filterMyCard(item.tag)"
                  >{{ item.tag }}[ {{ item.cnt }} ]</a
                >
              </div>
              <el-card
                shadow="hover"
                v-for="item in aRmtSvsLists"
                :key="item.ID"
                :id="'cdId' + item.ID"
                :label="item.title"
                :name="item.ID"
              >
                <a href="#" @click="'#' + item.ID">
                  <div class="winCtrl">
                    <i id="fltMneu">{{ item.title }}</i>
                    <i
                      class="icon-plus"
                      title="Duplicate a window so that multiple windows open a target server"
                      @click="fnDuplicate(item.ID)"
                    ></i>
                    <i
                      class="icon-cog"
                      title="config"
                      @click="fnEdit(item.ID)"
                    ></i>
                    <i
                      class="icon-eye-close"
                      title="Disconnect"
                      @click="disconnect($event, item.ID)"
                    ></i>
                    <i
                      class="icon-mail-reply"
                      title="back to view"
                      @click="fnMinWin"
                    ></i>
                    <i
                      class="icon-external-link-sign"
                      title="max window"
                      @click="fnMaxWin"
                    ></i>
                    <i
                      @click="fnFsc"
                      class="icon-fullscreen"
                      title="fullscreen"
                    ></i>
                  </div>
                  <div
                    class="myImg"
                    :id="'img' + item.ID"
                    :idDt="item.ID"
                    @click="handleCommand('/conn/' + item.ID)"
                    title="This is the most recent view, click to start connecting"
                  >
                    <img :src="item.imgData" />
                  </div>
                  <i class="clearfix"></i>
                  <iframe
                    src=""
                    class="ifrm"
                    @load="autoSaveImg($event, item.ID)"
                    :id="'ifrm' + item.ID"
                  ></iframe>
                </a>
              </el-card>
            </el-tab-pane>
            <el-tab-pane
              label="Remoute Config Manager"
              class="cfgrmt"
              name="RMCm1"
            >
              <router-view></router-view>
            </el-tab-pane>
            <el-tab-pane :label="ncctt" name="curConn">
              <CurConn></CurConn>
            </el-tab-pane>
            <el-tab-pane label="WorkSpance" name="tb02">
              <router-view name="targetMap"></router-view>
            </el-tab-pane>
            <el-tab-pane label="Intelligence"
              ><IntelligenceView></IntelligenceView
            ></el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
      <el-footer>
        <FooterComp></FooterComp>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import app from './lib/app'
export default app
</script>
<style lang="less">
@import url('css/app.css');
</style>
