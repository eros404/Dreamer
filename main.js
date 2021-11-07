const { app, shell, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

const deepdaze = require("./external_processes/deepdaze.js")
const pipInstall = require("./external_processes/pip_install.js")
const realsr = require("./external_processes/realsr.js")
const dialogHelper = require("./helpers/dialog_helper.js")
const collecManager = require("./helpers/collection_manager.js")
const winManager = require("./helpers/window_manager.js")


// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
    winManager.createMainWindow()
  
    app.on('activate', function () {
      // Sur macOS il est d'usage de recréer une fenêtre dans l'application quand
      // l'icône du dock est cliquée et qu'il n'y a pas d'autre fenêtre ouverte.
      if (winManager.windows.size === 0) createWindow()
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

ipcMain.on("exec-deepdaze", (event, scenario) => {
    if (!currentProcess || currentProcess.killed) {
        var imageDirectoryPath = path.join(collecManager.getPath(), 'deepdaze', scenario.directoryName)
        currentProcess = deepdaze.spawnDeepdaze(scenario, imageDirectoryPath)

        currentProcess.on('error', (error) => {
            dialogHelper.showError('Error occured.\r\n' + error)
        })

        currentProcess.stdout.setEncoding('utf8');
        currentProcess.stdout.on('data', (data) => winManager.sendImageProcessResponse(data.toString(), imageDirectoryPath))

        currentProcess.stderr.setEncoding('utf8');
        currentProcess.stderr.on('data', (data) => winManager.sendImageProcessResponse(data, imageDirectoryPath))

        currentProcess.on('close', (code) => {
            winManager.sendToMainWindow('deepdaze-close', code)
            currentProcess = null
        })
    } else {
        dialogHelper.showWarning('A process is already launched.')
    }
})

ipcMain.on("cancel-current-process", (event, args) => {
    if (!currentProcess.killed) {
        dialogHelper.askQuestion(winManager.mainWindow, 'Kill process', 'Do you really want to cancel the generation ?')
        .then(promise => {
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
        winManager.sendToMainWindow("deepdaze-installed-response", code)
    })
})
ipcMain.on("install-deepdaze", (event, args) => {
    var child = pipInstall.installDeepdaze()
    child.on('error', (error) => {
        dialogHelper.showError('Error occured.\r\n' + error)
    })
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => winManager.sendProcessResponseToMainWindow(data.toString()))
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => winManager.sendProcessResponseToMainWindow(data))
    child.on('close', (code) => {  
        winManager.sendToMainWindow('install-deepdaze-close', code)
    })
})

ipcMain.on("file-dialog", (event, args) => {
    dialogHelper.selectImage().then(result => {
        if (!result.canceled) {
            winManager.sendToMainWindow("file-dialog-response", result.filePaths[0])
        }
    })
})

ipcMain.on("open-image-collection", (event, args) => {
    winManager.createCollectionWindow()
})

ipcMain.on("ask-output-file-tree", (event, folder) => {
    collecManager.watchCollection(folder)
    winManager.sendToCollectionWindow("output-file-tree-response", collecManager.getCollection(folder))
})

ipcMain.on("ask-user-files-path", (event, args) => {
    var path = collecManager.getPath()
    fs.access(path, error => {
       winManager.sendToAllWindows("user-files-path-response", { path, isValid: !error })
    })
})

ipcMain.on("change-user-files-path", (event, args) => {
    dialogHelper.selectFolder("Where Dreamer must create his output directory ?", "Here !")
    .then(result => {
        if (!result.canceled) {
            fs.access(result.filePaths[0], error => {
                var outputPath = result.filePaths[0]
                if (!error) {
                    outputPath = collecManager.changeOutputPath(result.filePaths[0])
                }
                winManager.sendToAllWindows("user-files-path-response", { path: outputPath, isValid: !error })
            })
        }
    })
})

ipcMain.on("delete-folder", (event, path) => {
    collecManager.deleteFolder(path)
})
ipcMain.on("delete-image", (event, path) => {
    collecManager.deleteFile(path)
})

ipcMain.on("exec-realsr", (event, scenario) => {
    var process = realsr.spawnRealsr(scenario, path.join(__dirname, "contents"))
    process.on('error', (error) => {
        dialogHelper.showError('Error occured.\r\n' + error)
    })
    process.stdout.setEncoding('utf8')
    process.stdout.on('data', (data) => winManager.sendProcessResponseToCollectionWindow(data.toString()))
    process.stderr.setEncoding('utf8')
    process.stderr.on('data', (data) => winManager.sendProcessResponseToCollectionWindow(data))
    process.on('close', (code) => {  
        winManager.sendToCollectionWindow('exec-realsr-close', code)
    })
})

ipcMain.on("shell-open-path", (event, filePath) => {
    shell.openPath(filePath)
})