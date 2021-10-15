const child_process = require('child_process')

function spawnInstallDeepdaze() {
    return child_process.spawn('python', ['-m', 'pip', 'install', 'deep-daze'], {
        encoding: 'utf8',
        shell: false
    })
}

module.exports = {
    installDeepdaze: spawnInstallDeepdaze
}