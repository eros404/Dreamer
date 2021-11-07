const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')

const store = require("../data/store")
const fe = require("./file_explorer")
const winManager = require("./window_manager")
const dialogHelper = require("./dialog_helper")

function getPath() {
    return store.getUserImagesPath()
}

function getCollection(folder) {
    return fe.walkFolder(path.join(getPath(), folder))
}

var watchedPath
function changeOutputPath(outputPath) {
    if (!outputPath.match(/Dreamer$/i)) {
        outputPath = path.join(outputPath, "Dreamer"), (err) => {}
        fs.mkdir(outputPath, (err) => {})
    }
    fs.mkdir(path.join(outputPath, "deepdaze"), (err) => {})
    store.setUserImagesPath(outputPath)
    if (watchedPath) {
        watchCollection(path.basename(watchedPath))
    }
    return outputPath
}

var watcher
function watchCollection(generator) {
    var collectionPath = path.join(getPath(), generator)
    fs.access(collectionPath, error => {
        if (!error) {
            if (!watcher) {
                watcher = chokidar.watch(collectionPath, {
                    ignored: /(^|[\/\\])\../, // ignore dotfiles
                    persistent: true,
                    depth: 2
                })
                watcher.on("unlink", filePath => winManager.sendToCollectionWindow("element-deleted", filePath))
                watcher.on("unlinkDir", filePath => winManager.sendToCollectionWindow("element-deleted", filePath))
                watcher.on("add", filePath => {
                    if (fe.isImage(filePath)) {
                        winManager.sendToCollectionWindow("image-added", fe.getImageInfos(filePath))
                    }
                })
                watcher.on("addDir", dirPath => winManager.sendToCollectionWindow("dir-added", {
                    name: path.basename(dirPath),
                    path: dirPath,
                    images: []
                }))
                watcher.on("change", filePath => winManager.sendToCollectionWindow("file-changed", filePath))
            } else {
                cleanWatcher()
                watcher.add(collectionPath)
            }
            watchedPath = collectionPath
        }
    })
}
function cleanWatcher() {
    if (watchedPath) {
        watcher.unwatch(watchedPath)
        watchedPath = null
    }
}

function deleteContent(path, mesage, isFolder) {
    fs.access(path, error => {
        if (!error) {
            dialogHelper.askQuestion(winManager.collectionWindow, 'Delete content',  mesage)
            .then(promise => {
                if (promise.response == 0) {
                    fs.rm(path, {recursive: isFolder}, (err) => {})
                }
            })
        }
    })
}
function deleteFolder(path) {
    deleteContent(path, 'Do you really want to delete this folder and all his content ?', true)
}
function deleteFile(path) {
    deleteContent(path, 'Do you really want to delete this image ?', false)
}

module.exports = {
    getPath: getPath,
    getCollection: getCollection,
    changeOutputPath: changeOutputPath,
    watchCollection: watchCollection,
    cleanWatcher: cleanWatcher,
    deleteFolder: deleteFolder,
    deleteFile: deleteFile
}