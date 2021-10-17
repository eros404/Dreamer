const { app, shell, ipcMain, dialog, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

const deepdaze = require("./node_scripts/deepdaze.js")
const store = require("./node_scripts/store.js")
const pipInstall = require("./node_scripts/pip_install.js")
const fe = require("./node_scripts/file_explorer.js")


let windows = new Set()
let mainWindow
let currentProcess
function createWindow () {
    mainWindow = new BrowserWindow({
    width: 900,
    height: 1000,
    icon: path.join(__dirname, 'images', 'icon.png'),
    webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, 'node_scripts', 'preload.js')
        }
    })
    windows.add(mainWindow)
    mainWindow.on("closed", () => {
        windows.delete(mainWindow);
        mainWindow = null;
    });

    mainWindow.loadFile(path.join(__dirname, './pages/deepdaze.html'))
    // Ouvrir les outils de développement.
    //mainWindow.webContents.openDevTools()

    mainWindow.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url);
        return { action: 'deny' }
    });
}

function sendProcessResponse(data, imageDirectoryPath) {
    mainWindow.webContents.send('process-response', { output: data, imageDirectoryPath: path.join(imageDirectoryPath, "__IMAGENAME__") })
}
ipcMain.on("exec-deepdaze", (event, scenario) => {
    if (!currentProcess || currentProcess.killed) {
        var imageDirectoryPath = path.join(store.getUserImagesPath(), 'deepdaze', scenario.directoryName)
        currentProcess = deepdaze.spawnDeepdaze(scenario, imageDirectoryPath)

        currentProcess.on('error', (error) => {
            dialog.showMessageBox({
                title: 'Error',
                type: 'warning',
                message: 'Error occured.\r\n' + error
            })
        })

        currentProcess.stdout.setEncoding('utf8');
        currentProcess.stdout.on('data', (data) => sendProcessResponse(data.toString(), imageDirectoryPath))

        currentProcess.stderr.setEncoding('utf8');
        currentProcess.stderr.on('data', (data) => sendProcessResponse(data, imageDirectoryPath))

        currentProcess.on('close', (code) => {  
            mainWindow.webContents.send('deepdaze-close', code)
            currentProcess = null
        })
    } else {
        dialog.showMessageBox({
            title: 'Error',
            type: 'warning',
            message: 'A process is already launched.'
        })
    }
})
ipcMain.on("cancel-current-process", (event, args) => {
    if (!currentProcess.killed) {
        dialog.showMessageBox(mainWindow, {
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
    var child = pipInstall.installDeepdaze()
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
// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', function () {
      // Sur macOS il est d'usage de recréer une fenêtre dans l'application quand
      // l'icône du dock est cliquée et qu'il n'y a pas d'autre fenêtre ouverte.
      if (windows.size === 0) createWindow()
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

let collectionWindow
ipcMain.on("open-image-collection", (event, args) => {
    collectionWindow = new BrowserWindow({
        width: 900,
        height: 1000,
        icon: path.join(__dirname, 'images', 'icon.png'),
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'node_scripts', 'preload_collection.js')
        }
    })
    windows.add(collectionWindow)
    collectionWindow.on("closed", () => {
        windows.delete(collectionWindow)
        collectionWindow = null
    })

    collectionWindow.loadFile(path.join(__dirname, './pages/collection.html'))

    collectionWindow.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url);
        return { action: 'deny' }
    })
})

ipcMain.on("ask-output-file-tree", (event, args) => {
    collectionWindow.webContents.send("output-file-tree-response", fe.walkFolder(store.getUserImagesPath()))
})

ipcMain.on("ask-user-files-path", (event, args) => {
    var path = store.getUserImagesPath()
    var isValid = true
    fs.access(path, error => {
        if (error) {
            isValid = false
        }
        windows.forEach((window) => { window.webContents.send("user-files-path-response", { path, isValid }) })
    })
})

function changeOutputPath(outputPath) {
    if (!outputPath.match(/Dreamer$/i)) {
        outputPath = path.join(outputPath, "Dreamer"), (err) => {}
        fs.mkdir(outputPath, (err) => {})
    }
    fs.mkdir(path.join(outputPath, "deepdaze"), (err) => {})
    store.setUserImagesPath(outputPath)
    windows.forEach((window) => { window.webContents.send("user-files-path-response", { path: outputPath, isValid: true }) })
}
ipcMain.on("change-user-files-path", (event, args) => {
    dialog.showOpenDialog({
        title: "Where Dreamer must create his output directory ?",
        properties: ['openDirectory'],
        buttonLabel: "Here !"
    }).then(result => {
        if (!result.canceled) {
            fs.access(result.filePaths[0], error => {
                if (!error) {
                    changeOutputPath(result.filePaths[0])
                } else {
                    windows.forEach((window) => { window.webContents.send("user-files-path-response", { path: "none", isValid: false }) })
                }
            })
        }
    })
})