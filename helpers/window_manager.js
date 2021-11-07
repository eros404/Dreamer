const { shell, BrowserWindow } = require('electron')
const path = require('path')

const dialogHelper = require("./dialog_helper")
const collecManager = require("./collection_manager")

var windows = new Set()
var mainWindow
var collectionWindow

function createMainWindow() {
    mainWindow = new BrowserWindow({
    width: 900,
    height: 1000,
    icon: path.join(__dirname, '..', 'images', 'icon.png'),
    webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, '..', 'preloads', 'preload.js')
        }
    })
    windows.add(mainWindow)
    mainWindow.on("closed", () => {
        windows.delete(mainWindow);
        mainWindow = null;
    });

    mainWindow.loadFile(path.join(__dirname, '..', 'pages', 'deepdaze.html'))
    // Ouvrir les outils de développement.
    //mainWindow.webContents.openDevTools()

    mainWindow.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url);
        return { action: 'deny' }
    });
}

function createCollectionWindow() {
    if (collectionWindow) {
        dialogHelper.showWarning("You can't open 2 collection windows.")
        return
    }
    collectionWindow = new BrowserWindow({
        width: 900,
        height: 1000,
        icon: path.join(__dirname, '..', 'images', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, '..', 'preloads', 'preload_collection.js')
        }
    })
    windows.add(collectionWindow)

    collectionWindow.on("closed", () => {
        windows.delete(collectionWindow)
        collectionWindow = null
    })

    collectionWindow.loadFile(path.join(__dirname, '..', 'pages', 'collection.html'))

    collectionWindow.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url);
        return { action: 'deny' }
    })
}

function sendToMainWindow(channel, data) {
    if (mainWindow) {
        mainWindow.webContents.send(channel, data)
    }
}
function sendToCollectionWindow(channel, data) {
    if (collectionWindow) {
        collectionWindow.webContents.send(channel, data)
    }
}
function sendToAllWindows(channel, data) {
    windows.forEach((window) => {
        window.webContents.send(channel, data)
    })
}

function sendImageProcessResponse(data, imageDirectoryPath) {
    if (data) {
        sendToMainWindow('process-response', { output: data, imageDirectoryPath: path.join(imageDirectoryPath, "__IMAGENAME__") })
    }
}
function sendProcessResponseToMainWindow(data) {
    if (data) {
        sendToMainWindow('process-response', { output: data })
    }
}
function sendProcessResponseToCollectionWindow(data) {
    if (data) {
        sendToCollectionWindow('process-response', { output: data })
    }
}

module.exports = {
    windows: windows,
    mainWindow: mainWindow,
    collectionWindow: collectionWindow,
    createMainWindow: createMainWindow,
    createCollectionWindow: createCollectionWindow,
    sendToMainWindow: sendToMainWindow,
    sendToCollectionWindow: sendToCollectionWindow,
    sendToAllWindows: sendToAllWindows,
    sendImageProcessResponse: sendImageProcessResponse,
    sendProcessResponseToMainWindow, sendProcessResponseToMainWindow,
    sendProcessResponseToCollectionWindow: sendProcessResponseToCollectionWindow
}