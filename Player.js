const electron = require('electron')
const ipcRenderer = require('electron').ipcRenderer

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.remote.BrowserWindow

const path = require('path')
const url = require('url')

let playerWindow
var exports = module.exports = {}

exports.createPlayer = function() {
    playerWindow = new BrowserWindow({
      width: 900,
      height: 500,
      frame: true,
      resizable: true,
      maximizable: false,
      titleBarStyle: 'hidden',
    })

    playerWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'static/player.html'),
      protocol: 'file:',
      slashes: true
    }))

    playerWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      playerWindow = null
    })
}
