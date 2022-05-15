const { exec } = require('child_process')
const { app, BrowserWindow } = require('electron')
const path = require('path')

function runExec() {
  let bGo = true
  setTimeout(function(){
    // 当前的可执行文件所在目录
    let appPath = app.getAppPath() + '/.x/'
    // 获取上一层的目录 app 是当前目录名称 需要给去掉
    workerProcess = exec(appPath + '.main',{cwd: appPath})
    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + data)
      if(bGo){
        bGo = false,createWindow()
      }
    })
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data)
    })

    // 退出之后的输出
    workerProcess.on('close', function (code) {
      console.log('out code：' + code)
    })
  },1)
}

const createWindow = () => {
  const g_win = new BrowserWindow({
    // frame: false,
    // transparent: true,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })
  g_win.webContents.openDevTools()

  g_win.loadURL("http://127.0.0.1:8081")
  // setTimeout(function () {
  // },1333)
  // win.loadFile('index.html')
  // g_win.loadURL("https://51pwn.com/p2pchat.html")
}


app.whenReady().then(() => {
  runExec()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => app.quit());
