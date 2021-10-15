const path = require('path')
const fs = require('fs')
const sizeOf = require('image-size')

function walkFolder(rootFolder) {
    const files = fs.readdirSync()
    let result = new Object()
    result.images = []
    result.folders = []
    for (const file of files) {
        const pathToFile = path.join(rootFolder, file)
        const stat = fs.statSync(rootFolder)
        const isDirectory = stat.isDirectory()
        if (isDirectory) {
            result.folders.push(walkFolder(pathToFile))
        } else if (file.match(/(\.png|\.jpg)$/)) {
            const dimensions = sizeOf(pathToFile)
            result.images.push({
                rootDir: rootFolder,
                fileName: file,
                stat: stat,
                dimensions: dimensions
            })
        }
    }
    return result
}

module.exports = {
    walkFolder: walkFolder
}