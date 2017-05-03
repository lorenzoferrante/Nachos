const electron = require('electron')
const ipcRenderer = require('electron').ipcRenderer

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.remote.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')
const srt2vtt = require('srt-to-vtt')
const exec = require('child_process').exec

let playerWindow
let mainID, mainWin
let pidPeerflix
var exports = module.exports = {}

exports.createPlayer = function(pid) {
    playerWindow = new BrowserWindow({
      width: 900,
      height: 500,
      frame: true,
      resizable: true,
      maximizable: false,
      titleBarStyle: 'hidden',
    })

    pidPeerflix = pid

    mainID = getMainID()
    mainWin = BrowserWindow.fromId(mainID)
    mainWin.hide()

    playerWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../static/player.html'),
      protocol: 'file:',
      slashes: true
    }))

    playerWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      console.log('Killing Peerflix with PID: ' + pidPeerflix)
      killProcess(pidPeerflix)

      mainWin.show()
      playerWindow = null
    })
}

function getMainID() {
    let mainID
    let winds = BrowserWindow.getAllWindows()

    for (var i = 0; i < winds.length; i++) {
        if (playerWindow.id != winds[i].id) {
            mainID = winds[i].id
            console.log(mainID)
        }
    }
    return mainID
}

function killProcess(pid) {
    let cmd = 'kill ' + pid
    exec(cmd, (err, stderr, stdout) => {
        if (err) {
            console.log(err)
            return
        }

        console.log(stdout)
        console.log(stderr)
    })
}

exports.serveSubtitle = function(path) {
    fs.createReadStream(path)
        .pipe(srt2vtt())
        .pipe(fs.createWriteStream('sub/sub.vtt'))
}
