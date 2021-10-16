const path = require('path')
const fs = require('fs')
const sizeOf = require('image-size')

function walkFolder(rootFolder) {
    const files = fs.readdirSync(rootFolder)
    let folder = new Object()
    folder.name = path.basename(rootFolder)
    folder.path = rootFolder
    folder.images = []
    folder.folders = []
    for (const file of files) {
        const pathToFile = path.join(rootFolder, file)
        const stat = fs.statSync(pathToFile)
        const isDirectory = stat.isDirectory()
        if (isDirectory) {
            folder.folders.push(walkFolder(pathToFile))
        } else if (file.match(/(\.png|\.jpg)$/)) {
            const dimensions = sizeOf(pathToFile)
            folder.images.push({
                rootDir: rootFolder,
                filePath: pathToFile,
                fileName: file,
                stat: stat,
                dimensions: dimensions
            })
        }
    }
    return folder
}

module.exports = {
    walkFolder: walkFolder
}