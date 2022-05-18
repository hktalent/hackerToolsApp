export default {
  fnMaxWin: function (o) {
    o.className = o.className + ' maxWin'
  },
  fnMinWin: function (o, doc) {
    o.className = 'el-card is-hover-shadow'
    function fnMinw () {
      const w = doc
      const xx1 = w.exitFullscreen || w.mozCancelFullScreen || w.webkitExitFullscreen || w.msExitFullscreen
      if (xx1) {
        xx1.call(doc)
      }
    }
    fnMinw()
  },
  fnFullScreen: function (szId) {
    /* Get into full screen */
    function GoInFullscreen (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    }
    GoInFullscreen(szId)
  },
  fnAutoFocus: function () {
    document.body.onkeydown = function (event) {
      const e = event || (window.event ? window.event : null)
      // 按下回车键且输入框值非空时
      if (e.keyCode === 13) {
        e.keyCode = 9
        return true
      }
    }
  }
}
