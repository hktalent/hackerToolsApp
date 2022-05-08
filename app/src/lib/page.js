const puppeteer = require('puppeteer'),fs = require('fs');

/**
* Secure Hash Algorithm (SHA1)
* http://www.webtoolkit.info/
**/
function SHA1 (msg) {
  function rotate_left (n, s) {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  };
  function lsb_hex (val) {
    var str = '';
    var i;
    var vh;
    var vl;
    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };
  function cvt_hex (val) {
    var str = '';
    var i;
    var v;
    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };
  function Utf8Encode (string) {
    string = string.replace(/\r\n/g, '\n');
    var utftext = '';
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg);
  var msg_len = msg.length;
  var word_array = new Array();
  for (i = 0; i < msg_len - 3; i += 4) {
    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
      msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
    word_array.push(j);
  }
  switch (msg_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
      break;
    case 2:
      i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
      break;
    case 3:
      i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
      break;
  }
  word_array.push(i);
  while ((word_array.length % 16) != 14) word_array.push(0);
  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);
  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();
}
/*
await page.setRequestInterception(true);
page.on('request', (request) => {
  if (request.isInterceptResolutionHandled()) return;

  // Override headers
  const headers = Object.assign({}, request.headers(), {
    foo: 'bar', // set "foo" header
    origin: undefined, // remove "origin" header
  });
  request.continue({ headers });
});
*/
function fnGetUrl (a) {
  (async () => {
    // ,viewport:{isMobile:true},timeout:10000
    const browser = await puppeteer.launch({ignoreHTTPSErrors:true,timeout:50000});
    const page = await browser.newPage();
    // page.setDefaultTimeout(10000)
    for (var i = 0; i < a.length; i++) {
      try{
        var szFileName = SHA1(a[i])+ "_" + a[i].length +'.webp';
        if(fs.existsSync(szFileName))
        {
          continue;
        }
        await page.goto(a[i]);
        // const dimensions = await page.evaluate(() => {
        //   // 这里判断后再保存，这里还可以获取页面的form表单
        //   // 为了加快速度，还可以过滤掉图片，css的请求
        //   return {
        //     width: document.documentElement.clientWidth,
        //     height: document.documentElement.clientHeight,
        //     deviceScaleFactor: window.devicePixelRatio,
        //   };
        // });
        console.log(a[i] + " is ok");
        await page.screenshot({ path: szFileName, fullPage: true });
      }catch(e){
        console.log([a[i],e])
      }
    }
    await browser.close();
  })();
}

var a = `http://syappht.wjw.gzz.gov.cn
https://www.cqgjj.cn/info/iList.jsp?cat_id=10046
http://www.sc.hrss.gov.cn/scsbwt/zccx/index.jhtml
http://103.203.218.250:8041/scrc/login.jsp
https://www.yaszfgjjzx.org.cn/netface/down.do
http://www.yinhaiyun.com/pc/gd_1577342576000/index.html
http://www.pzhgjj.com/pzhnt/down.do
https://jzt.xzggjyzpw.com/app/article/content/1000001641.shtml
http://wt.zfgjj.fcgs.gov.cn/
http://gzzzfgjj.com/gznt/down.do
http://www.xygjj.cn:8890/surfane/knowledge.action
https://gjj.dt.gov.cn:10/netface/getpwd.do
https://www.cqgjj.cn/info/iList.jsp?cat_id=10046
http://www.sc.hrss.gov.cn/scsbwt/zccx/index.jhtml
http://103.203.218.250:8041/scrc/login.jsp
https://www.yaszfgjjzx.org.cn/netface/down.do
http://www.pzhgjj.com/pzhnt/down.do
http://www.yinhaiyun.com/pc/gd_1577342576000/index.html
http://www.xygjj.cn:8890/surfane/knowledge.action
https://jzt.xzggjyzpw.com/app/article/content/1000001641.shtml
http://wt.zfgjj.fcgs.gov.cn/
http://gzzzfgjj.com/gznt/down.do
http://zfgjjwt.guilin.gov.cn/netface//down.do
https://gjj.dt.gov.cn:10/netface/getpwd.do
http://www.lyzfgjj.com/down.do
http://www.gxwzgjj.gov.cn/netface/CorpOnlineRegisterAction.do
https://61.185.220.174:7316/userinfo/userPasswordModify.do
http://bhzfgjj.gjj.beihai.gov.cn/netface/LiberalProInfoAction!dkzm.do
https://www.xxgjj.com:8011/netface/getpwd.do
https://asgjj.anshun.gov.cn:8097/netface/infor/queryAction!queryBuilding.do?p=9f0d7b35-90a8
http://xzgjjapp.sxxz.gov.cn/netface/down.do
https://gjj.leshan.gov.cn/netface/getpwd.do
http://182.150.40.151/fwwd/
http://118.122.124.71:6099/fdams/business/apply!toIndex.do
https://gjjwt.zhanjiang.gov.cn:1443/netface/getpwd.do
https://wt.smxgjj.com/netface/liberalRegisterAction.do
http://wt.zfgjj.xuchang.gov.cn/netface/login.do
https://www.msgjj.com/netface/getpwd.do
http://wx.tlgjjwx.com:8005/netface/corpRegisterAction.do
http://lssb1.e-shebao.com/
https://weixin.ncgjj.com.cn:7980/netface/local/chgphone.do
https://old.jlgjj.gov.cn:7009/netface/login.do
http://wt.gjj.shangqiu.gov.cn/netface/per/liberalRegisterAction.do
https://gjj.caep.cn/jywt
https://www.csgjj.com.cn/netface/corp/chgacc/corpOpenAccAction.do
https://www.jsdfpsj.com/xzgjj_/wsywdt/
https://wt.scsjgjj.com/netface/reg!auth.do
https://www.jzdyb.com/log/%E6%A3%80%E5%AE%9A%E8%AF%81%E4%B9%A6%E7%BC%96%E5%8F%B7%E6%9F%A5%E8%AF%A2.html
http://1.85.55.147:8002/auth_front/auth/passwordResetAction.do
http://61.177.252.165/netface/login.do
http://113.140.18.123:8100/wsfw/netHallBaseAction.do?menuid=8082729&target=8082729&fwid=W00801&contenttype=&s=wt
https://network.fzgjj.com.cn/netface/corpRegisterAction.do
https://www.tdedb.com/blog/%E5%9B%BD%E5%AE%B6%E6%96%87%E7%89%A9%E9%89%B4%E5%AE%9A%E4%B8%AD%E5%BF%83%E8%AF%81%E4%B9%A6%E6%9F%A5%E8%AF%A2.html
http://wt.zfgjj.liuzhou.gov.cn/lznt
http://ncgjj.nc.gov.cn/nczfgjj/dkssgj/list_no_tt.shtml
http://jnrcbz.cettic.gov.cn/
http://0734abc.com/pc/yhlq_1585032782000/index.html
http://59.175.218.203:8081/zcsb/
http://jtt.hubei.gov.cn/zyzgzx/xzzx/zhzl/201912/W020191209674756730013.docx
http://yuhuajin.com/_redirect?siteId=33&columnId=1006&articleId=16531
http://wx.sxty12320.com/tywscx/mobile/yszgsjjnExamQuery.jsp
https://m.duxue.org/a/k37_86231.html?a=%E5%9B%9B%E5%B7%9D%E4%B9%85%E8%BF%9C%E9%93%B6%E6%B5%B7%E8%BD%AF%E4%BB%B6%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8
https://www.gzxinde.com/a/k38_88678.html?a=%E5%9B%9B%E5%B7%9D%E4%B9%85%E8%BF%9C%E9%93%B6%E6%B5%B7%E8%BD%AF%E4%BB%B6%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8
https://www.xuankw.com/info/%E9%89%B4%E5%AE%9A%E8%AF%81%E4%B9%A6%E7%BC%96%E5%8F%B7%E6%9F%A5%E8%AF%A2%E5%AE%98%E7%BD%91.html
https://www.fokyl.com/news/%E9%9D%9E%E5%8D%B1%E9%99%A9%E5%93%81%E9%89%B4%E5%AE%9A%E8%AF%81%E4%B9%A6%E6%9F%A5%E8%AF%A2.html
https://www.msha3.com/news/%E7%9C%81%E9%89%B4%E5%AE%9A%E4%B8%AD%E5%BF%83%E7%9A%84%E5%AE%98%E7%BD%91.html
http://1.85.55.147:8002/auth_front/auth/passwordResetAction.do
http://103.203.218.250:8023/login.jsp
http://103.203.218.250:8041/scrc/login.jsp
http://103.203.218.250:8041/scrc/rsrc/jgyx/manage/bussiness/accountRegistraController.do
http://113.140.18.123/xawt/login.jz.jsp?type=3
http://119.6.50.201:9999/surfane/knowledge.action
http://218.206.180.132
http://218.206.180.132/emplogin.jsp
http://218.206.180.132/gr_login.jsp
http://218.6.145.141:7000/yhcms/
http://222.169.170.135:7003/yhwtqt/login.jsp
http://222.85.128.66:8007/ssologin/login
http://61.177.252.165/netface/dev/sub/devSubAgree.do
http://bhzfgjj.gjj.beihai.gov.cn/netface/LiberalProInfoAction!dkzm.do
http://czt.sc.gov.cn/hmhn/zcfg/index.jhtml
http://gjjwt.tianshui.gov.cn/netface/down.do
http://gzzzfgjj.com/gznt/down.do
http://hgwsbs.hg12333.com/hgwt/member/login.jhtml
http://rswb.gx12333.net/member/register.jhtml
http://scnc.lss.gov.cn:82/114627.jhtml
http://sfrz.xzzwfw.gov.cn:8081/sfrz/ids/netUserLogin/oauth2.do
http://tasktan.co.tz/login
http://wsdt.ybj.gxzf.gov.cn/member/register.jhtml
http://wt.gjj.shangqiu.gov.cn/netface/login.do
http://wt.rsj.taiyuan.gov.cn/service/158098.jhtml
http://wt.zfgjj.fcgs.gov.cn/login.do
http://wt.zfgjj.xuchang.gov.cn/netface/weixin/login.jsp?s=random1
http://www.gxwzgjj.gov.cn/netface/CorpOnlineRegisterAction.do
http://www.lyzfgjj.com:7011/surtalk//login.jsp
http://www.pzhgjj.com/pzhnt/getpwd.do
http://www.pzhgjj.com/pzhnt/login.do
http://www.pzhgjj.com/pzhnt/reg.do
http://www.yinhaiyun.com/casserver/login
http://zfgjjwt.guilin.gov.cn/netface/login.do
https://61.185.220.174:7316/userinfo/personalUserInfoAction.do
https://aabbccd.com/gjj/netface/login/
https://corp-office.cqgjj.cn/netface/login.do
https://erp.yinhai.com:8443/portal/login.html
https://gjj.dt.gov.cn/netface/login.do?t=2
https://gjjwt.zhanjiang.gov.cn:5443/surtalk/
https://jnrcbz.cettic.gov.cn
https://person-office.cqgjj.cn:9443/netface/loanorder.do
https://weixin.ncgjj.com.cn:7980/netface/login.do
https://wt.scsjgjj.com/netface/login.do
https://wt.smxgjj.com/netface/login.do
https://www.csgjj.com.cn/netface/getpwd.do
https://www.xngjjapp.com
https://www.yaszfgjjzx.org.cn/netface/login.do
https://ywdt.xygjj.cn/netface/getpwd.do
https://zfgjj.leshan.gov.cn/netface/getpwd.do
https://zfgjj.leshan.gov.cn/netface/login.do
http://218.89.38.36:8090/l.jsp
http://125.64.60.11:8000/gywssb/l.jsp
http://www.gdsi.gov.cn:7003/gyww/l.jsp
http://www.scgy.lss.gov.cn:8000/gywssb/l.jsp
http://218.89.38.36:8090/CMHS?CMHS=XFaceUpLoadFileSvlt
http://218.89.38.36:8090/l.jsp
http://125.64.60.11:8000/gywssb/l.jsp
http://www.gdsi.gov.cn:7003/gyww/l.jsp
http://www.scgy.lss.gov.cn:8000/gywssb/l.jsp
http://www.gdsi.gov.cn:7003/gyww/CMHS?CMHS=RedAMF3Object
http://117.36.52.42:8001/
http://117.36.52.39:7001/
http://www.scgy.lss.gov.cn:8000/gywssb/
http://www.scdy.lss.gov.cn/ta3admin/ta3cms/login.go
http://59.175.218.199:8080/hbjzaz/login.jsp
http://118.112.188.108:8602/misyh/login.jsp
http://125.69.70.49:8088/scmonitor/login.jsp
http://183.203.216.206:8800/tywscx/login.jsp
http://183.203.216.206:8801/tyxsjc/login.jsp
http://119.6.84.250:7003/queryPersonInfoAction.do
https://odzfb.cdhrss.gov.cn:8443/yhjypt/oauth/getLoginTokenH5Action.do
https://odzfb.cdhrss.gov.cn:7777/cbc_server/cbcsi/html/index/index.html
http://118.122.251.6:8088/gzqw/indexAction.do
http://59.175.230.248:8009/whylxt/login.jsp
http://59.175.230.248:8011/whjzjz/login.jsp
http://219.140.166.16:39080/hbjzjz/login.jsp
http://www.scdy.lss.gov.cn:8000/SBK/
http://114.255.111.115/bjwtqt/netHallLoginAction!login.do
http://jyb.hrss.tj.gov.cn:7081/tjsyapp/
http://118.122.8.171:8003/lsui/203855.jhtml
http://scnc.lss.gov.cn/383125.jhtml
http://gryh.ycgjj.com/ycwt/login.do?ver=unit
http://www.msgjj.com/netface/weixin/login.jsp
http://www.tsgjj.gov.cn:7003/login.jsp
http://59.175.218.202:7005/hbwssb/login.jsp
http://www.hbxn.hrss.gov.cn/xnrswt/member/login.jhtml
http://219.138.246.147/tmwt/member/login.jhtml
http://pxgl.kmjy.gov.cn:8888
https://180.142.129.168
http://online.zysrsj.gov.cn
http://118.112.188.108:9700/console/login/LoginForm.jsp
http://61.128.114.133
https://yinhai.webex.com.cn/yinhai/onstage/g.php?MTID=e41f3a2e8bd0a23c067ddde166e96b724
http://xdzsis.xdz.gov.cn:7317
http://222.83.228.143:7003/ggapp/front/services/si/login
http://117.190.139.118:8003/cashier
http://117.190.139.118:8005/sipay
https://es.cdhrss.chengdu.gov.cn:442/cdwsjb/indexAction.do`.split('\n')

fnGetUrl(a, 'syappht.wjw')