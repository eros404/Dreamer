const child_process = require('child_process')
const path = require('path')
const os = require('os');

function getRealsrArguments(scenario) {
    var input = scenario.inputPath
    var arguments = [
        "-i", input,
        "-s", "4",
        "-o", scenario.outputPath
    ]
    if (scenario.enableTTA == true) {
        arguments.push("-x")
    }
    return arguments
}

function spawnRealsr(scenario, contentsPath) {
    var plateform = os.platform()
    var realsrPath = path.join(contentsPath, "realsr-ncnn-vulkan-20210210-windows")
    if (plateform == 'LINUX') {
        realsrPath = path.join(contentsPath, "realsr-ncnn-vulkan-20210210-ubuntu")
    } else if (plateform == 'MAC') {
        realsrPath = path.join(contentsPath, "realsr-ncnn-vulkan-20210210-macos")
    }
    return child_process.spawn(plateform == 'WINDOWS' ? "realsr-ncnn-vulkan.exe" : "realsr-ncnn-vulkan", getRealsrArguments(scenario), {
        encoding: 'utf8',
        shell: false,
        cwd: realsrPath
    })
}

module.exports = {
    spawnRealsr: spawnRealsr
}