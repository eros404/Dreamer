const { app, ipcMain, dialog, BrowserWindow } = require('electron')
const child_process = require('child_process')
const path = require('path')
const fs = require('fs')

const scenarios = require("./node_scripts/scenarios_exports.js")

let mainWindow;
function createWindow () {
  // Créer la fenêtre de navigation.
    mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, 'node_scripts', 'preload.js')
    }
  })

  // et charger l'index.html de l'application.
  mainWindow.loadFile('index.html')
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


ipcMain.on("exec-deepdaze", (event, args) => {
    let directoryName = new Date().toISOString().replace(/T/, '_').replaceAll(":", '-').replace(/\..+/, '')
    let directoryPath = path.join(__dirname, 'user_images', 'deepdaze', directoryName)
    fs.mkdir(directoryPath, (err) => {})
    var child = child_process.spawn("imagine", scenarios.getDeepdazeArguments(args), {
        encoding: 'utf8',
        shell: false,
        cwd: directoryPath
    });
    // You can also use a variable to save the output for when the script closes later
    child.on('error', (error) => {
        dialog.showMessageBox({
            title: 'Error',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        //Here is the output
        data=data.toString()
        mainWindow.webContents.send('deepdaze-response', data)
    })

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        data=data.toString()
        // Return some data to the renderer process with the mainprocess-response ID
        mainWindow.webContents.send('deepdaze-response', data)
    });

    child.on('close', (code) => {
        //Here you can get the exit code of the script  
        mainWindow.webContents.send('deepdaze-close', code)
    });

    ipcMain.on("cancel-deepdaze", (event, args) => {
        child.kill()
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