const { app, ipcMain, dialog, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const Store = require('electron-store');

const deepdaze = require("./node_scripts/deepdaze.js")

const store = new Store();

let mainWindow;
function createWindow () {
  // Créer la fenêtre de navigation.
    mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    icon: path.join(__dirname, 'images', 'icon.png'),
    webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, 'node_scripts', 'preload.js')
    }
  })

  // et charger l'index.html de l'application.
  mainWindow.loadFile(path.join(__dirname, 'deepdaze.html'))
  // Ouvrir les outils de développement.
  mainWindow.webContents.openDevTools()
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', function () {
      // Sur macOS il est d'usage de recréer une fenêtre dans l'application quand
      // l'icône du dock est cliquée et qu'il n'y a pas d'autre fenêtre ouverte.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
  
// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Sur macOS, il est courant
// pour les applications et leur barre de menu de rester actives jusqu’à ce que l’utilisateur quitte
// explicitement avec Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

let currentProcess
function sendProcessResponse(data) {
    mainWindow.webContents.send('process-response', data)
}

ipcMain.on("exec-deepdaze", (event, args) => {
    if (!currentProcess || currentProcess.killed) {
        currentProcess = deepdaze.spawnDeepdaze(args, __dirname)

        currentProcess.on('error', (error) => {
            dialog.showMessageBox({
                title: 'Error',
                type: 'warning',
                message: 'Error occured.\r\n' + error
            })
        })

        currentProcess.stdout.setEncoding('utf8');
        currentProcess.stdout.on('data', (data) => sendProcessResponse(data.toString()))

        currentProcess.stderr.setEncoding('utf8');
        currentProcess.stderr.on('data', (data) => sendProcessResponse(data))

        currentProcess.on('close', (code) => {  
            mainWindow.webContents.send('deepdaze-close', code)
        })
    } else {
        dialog.showMessageBox({
            title: 'Error',
            type: 'warning',
            message: 'A process is already launched' + error
        })
    }
})

ipcMain.on("cancel-current-process", (event, args) => {
    if (!currentProcess.killed) {
        dialog.showMessageBox({
            title: 'Kill process',
            type: 'question',
            message: 'Do you really want to cancel the generation ?',
            buttons: ['Yes', 'No'],
            defaultId: 1
        }).then(promise => {
            if (promise.response == 0) {
                currentProcess.kill()
            }
        })
    }
})

ipcMain.on("ask-deepdaze-installed", (event, args) => {
    var child = deepdaze.spawnDeepdazeInstalled()
    child.on('error', (error) => {})
    child.on('close', (code) => {  
        mainWindow.webContents.send("deepdaze-installed-response", code)
    })
})
ipcMain.on("install-deepdaze", (event, args) => {
    var child = deepdaze.spawnInstallDeepdaze()
    child.on('error', (error) => {
        dialog.showMessageBox({
            title: 'Error',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        })
    })
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => sendProcessResponse(data.toString()))
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => sendProcessResponse(data))
    child.on('close', (code) => {  
        mainWindow.webContents.send('install-deepdaze-close', code)
    })
})

ipcMain.on("file-dialog", (event, args) => {
    dialog.showOpenDialog(mainWindow, {
        filters: [{ name : 'Images', extensions: ['jpg', 'png'] }],
        properties: ["openFile"]
    }).then(result => {
        if (!result.canceled) {
            mainWindow.webContents.send("file-dialog-response", result.filePaths[0])
        }
    })
})