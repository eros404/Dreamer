const child_process = require('child_process')
const path = require('path')
const fs = require('fs')

function getDeepdazeArguments(deepdazeScenario) {
    var arguments = [
        "\"" + deepdazeScenario.text + "\"",
        "--epochs=" + deepdazeScenario.epochs,
        "--iterations=" + deepdazeScenario.iterations,
        "--save_every=" + deepdazeScenario.saveEvery,
        "--image_width=" + deepdazeScenario.imageWidth,
        "--deeper=" + (deepdazeScenario.deeper ? "True" : "False"),
        "--open_folder=" + (deepdazeScenario.openFolder ? "True" : "False"),
        "--save_gif=" + (deepdazeScenario.saveGIF ? "True" : "False")
    ]
    if (deepdazeScenario.image) {
        arguments.push("--img=" + deepdazeScenario.image)
    }
    return arguments
}

function spawnDeepdaze(args, dirname) {
    let directoryName = new Date().toISOString().replace(/T/, '_').replaceAll(":", '-').replace(/\..+/, '')
    let directoryPath = path.join(dirname, 'user_images', 'deepdaze', directoryName)
    fs.mkdir(directoryPath, (err) => {console.log(err)})
    return child_process.spawn("imagine", getDeepdazeArguments(args), {
        encoding: 'utf8',
        shell: false,
        cwd: directoryPath
    })
}

function spawnDeepdazeInstalled() {
    return child_process.spawn('imagine', ['--', '--help'], {
        encoding: 'utf8',
        shell: false
    })
}

function spawnInstallDeepdaze() {
    return child_process.spawn('python', ['-m', 'pip', 'install', 'deep-daze'], {
        encoding: 'utf8',
        shell: false
    })
}

module.exports = {
    spawnDeepdaze: spawnDeepdaze,
    spawnDeepdazeInstalled: spawnDeepdazeInstalled,
    spawnInstallDeepdaze: spawnInstallDeepdaze
}