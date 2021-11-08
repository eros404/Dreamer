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
        "--save_gif=" + (deepdazeScenario.saveGIF ? "True" : "False"),
        "--learning_rate=" + deepdazeScenario.learningRate,
        "--num_layers=" + deepdazeScenario.numLayers,
        "--hidden_size=" + deepdazeScenario.layerSize,
        "--batch_size=" + deepdazeScenario.batchSize,
    ]
    if (deepdazeScenario.image) {
        arguments.push("--img=" + deepdazeScenario.image)
    }
    if (deepdazeScenario.initImage) {
        arguments.push("--start_image_path=" + deepdazeScenario.initImage)
        arguments.push("--start_image_train_iters=" + deepdazeScenario.initImageTrain)
    }
    return arguments
}

function spawnDeepdaze(scenario, directoryPath) {
    fs.mkdir(directoryPath, (err) => {})
    return child_process.spawn("imagine", getDeepdazeArguments(scenario), {
        encoding: 'utf8',
        shell: false,
        cwd: directoryPath
    })
}

function spawnDeepdazeHelp() {
    return child_process.spawn('imagine', ['--', '--help'], {
        encoding: 'utf8',
        shell: false
    })
}

module.exports = {
    spawnDeepdaze: spawnDeepdaze,
    spawnDeepdazeInstalled: spawnDeepdazeHelp
}