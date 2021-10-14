const child_process = require('child_process')

function spawnInstallDeepdaze() {
    return child_process.spawn('python', ['-m', 'pip', 'install', 'deep-daze'], {
        encoding: 'utf8',
        shell: false
    })
}

function spawnInstallCUDAWindows() {
    return child_process.spawn('python', [
        '-m', 'pip', 'install', 'torch==1.9.1+cu111', 'torchvision==0.10.1+cu111', 'torchaudio===0.9.1',
        '-f', 'https://download.pytorch.org/whl/torch_stable.html'
    ], {
        encoding: 'utf8',
        shell: false
    })
}

function spawnInstallCUDALinux() {
    return child_process.spawn('python', [
        '-m', 'pip', 'install', 'torch==1.9.1+cu111', 'torchvision==0.10.1+cu111', 'torchaudio==0.9.1',
        '-f', 'https://download.pytorch.org/whl/torch_stable.html'
    ], {
        encoding: 'utf8',
        shell: false
    })
}

module.exports = {
    installDeepdaze: spawnInstallDeepdaze,
    installCUDAWindows: spawnInstallCUDAWindows,
    installCUDALinux: spawnInstallCUDALinux
}