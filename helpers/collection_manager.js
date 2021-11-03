const path = require('path')
const fs = require('fs')

const store = require("../data/store.js")
const fe = require("./file_explorer.js")
const winManager = require("./window_manager.js")

function getPath() {
    return store.getUserImagesPath()
}

function getCollection(folder) {
    return fe.walkFolder(path.join(getPath(), folder))
}

function changeOutputPath(outputPath) {
    if (!outputPath.match(/Dreamer$/i)) {
        outputPath = path.join(outputPath, "Dreamer"), (err) => {}
        fs.mkdir(outputPath, (err) => {})
    }
    fs.mkdir(path.join(outputPath, "deepdaze"), (err) => {})
    store.setUserImagesPath(outputPath)
    return outputPath
}

function deleteContent(path, mesage, isFolder) {
    fs.access(path, error => {
        if (!error) {
            dialogHelper.askQuestion(winManager.collectionWindow, 'Delete content',  mesage)
            .then(promise => {
                if (promise.response == 0) {
                    fs.rm(path, {recursive: isFolder}, (err) => {
                        if (!err) {
                            winManager.sendToCollectionWindow("element-deleted", path)
                        }
                    })
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
    deleteFolder: deleteFolder,
    deleteFile: deleteFile
}