class DeepdazeScenario {
    constructor(text, image, epochs, iterations, saveEvery, imageWidth,
        deeper, openFolder, saveGIF,
        learningRate, numLayers, layerSize, batchSize) {
        this.text = text.trim()
        this.image = image
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