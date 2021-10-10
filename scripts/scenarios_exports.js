function getDeepdazeArguments(deepdazeScenario) {
    return ([
        "\"" + deepdazeScenario.text + "\"",
        "--epochs=" + deepdazeScenario.epochs,
        "--iterations=" + deepdazeScenario.iterations,
        "--save_every=" + deepdazeScenario.saveEvery,
        "--image_width=" + deepdazeScenario.imageWidth,
        "--deeper=" + deepdazeScenario.deeper,
        "--open_folder=" + deepdazeScenario.openFolder,
        "--save_gif=" + deepdazeScenario.saveGIF
    ])
}

module.exports = { getDeepdazeArguments: getDeepdazeArguments }