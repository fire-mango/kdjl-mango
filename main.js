const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  // 打印路径，验证是否正确
  const preloadPath = path.resolve(__dirname, './preload.js')
  console.log('Preload 实际路径：', preloadPath) // 终端核对是否是 D:\Project\kdjl\kdjl-mango\preload.js

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath, // 核心：正确指向preload.js
      contextIsolation: true, // 必须开启
      nodeIntegration: false
    }
  })

  // 加载 src 下的 index.html（从目录树看，index.html 有两个，需确认加载 src 下的）
  win.loadFile(path.join(__dirname, './src/index.html'))
  // 可选：打开DevTools调试
  win.webContents.openDevTools()
}

// 补充 ping 监听，避免调用失败
ipcMain.handle('ping', async () => {
  return 'pong'
})

app.whenReady().then(createWindow)