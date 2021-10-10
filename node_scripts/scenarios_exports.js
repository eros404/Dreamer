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

module.exports = { getDeepdazeArguments: getDeepdazeArguments }