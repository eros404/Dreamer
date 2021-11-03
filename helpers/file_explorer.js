const path = require('path')
const fs = require('fs')
const sizeOf = require('image-size')

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getFolderImages(folder) {
    var images = []
    const files = fs.readdirSync(folder)
    for (const file of files) {
        const filePath = path.join(folder, file)
        const stat = fs.statSync(filePath)
        if (stat.isFile() && file.match(/(\.png|\.jpg|\.gif)$/)) {
            images.push({
                name: file,
                path: filePath,
                size: formatBytes(stat.size, 1),
                stat: stat,
                dimensions: sizeOf(filePath),
                rootDir: folder
            })
        }
    }
    return images
}

function walkFolder(rootFolder) {
    const files = fs.readdirSync(rootFolder)
    var folders = []
    for (const file of files) {
        const pathToFile = path.join(rootFolder, file)
        const stat = fs.statSync(pathToFile)
        if (stat.isDirectory()) {
            folders.push({
                name: path.basename(pathToFile),
                path: pathToFile,
                images: getFolderImages(pathToFile)
            })
        }
    }
    return folders
}

function getImageInfos(filePath) {
    const stat = fs.statSync(filePath)
    return {
        name: path.basename(filePath),
        path: filePath,
        size: formatBytes(stat.size, 1),
        stat: stat,
        dimensions: sizeOf(filePath),
        rootDir: path.dirname(filePath)
    }
}

module.exports = {
    walkFolder: walkFolder,
    getImageInfos: getImageInfos
}