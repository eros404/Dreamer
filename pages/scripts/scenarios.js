class DeepdazeScenario {
    constructor(text, image, initImage, initImageTrain, epochs, iterations, saveEvery, imageWidth,
        deeper, openFolder, saveGIF,
        learningRate, numLayers, layerSize, batchSize) {
        this.text = text.trim()
        this.image = image
        this.initImage = initImage
        this.initImageTrain = initImageTrain
        this.epochs = epochs
        this.iterations = iterations
        this.saveEvery = saveEvery
        this.imageWidth = imageWidth
        this.deeper = deeper
        this.openFolder = openFolder
        this.saveGIF = saveGIF,
        this.learningRate = learningRate,
        this.numLayers = numLayers,
        this.layerSize = layerSize,
        this.batchSize = batchSize,
        this.directoryName = (new Date().toISOString().replaceAll(/[TZ]/g, "_") + "_" + this.text).replace(/[^a-z0-9_\-]/gi, "_").toLowerCase().replace(/_{2,}/g, '_')
    }
}

class RealsrScenario {
    constructor(inputPath, enableTTA) {
        this.inputPath = inputPath,
        this.enableTTA = enableTTA,
        this.outputPath = this.inputPath.slice(0, (this.inputPath.length - this.inputPath.match(/\.[a-zA-Z]+$/)[0].length)) + ".x4" + (this.enableTTA ? "tta" : "") + this.inputPath.slice((this.inputPath.length - this.inputPath.match(/\.[a-zA-Z]+$/)[0].length))
    }
}