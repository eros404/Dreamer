const { dialog } = require('electron')

function showError(message) {
    dialog.showMessageBox({
        title: 'Error',
        type: 'error',
        message: message
    })
}

function showWarning(message) {
    dialog.showMessageBox({
        title: 'Warning',
        type: 'warning',
        message: message
    })
}

function askQuestion(window, title, message) {
    return dialog.showMessageBox(window, {
        title: title,
        type: 'question',
        message: message,
        buttons: ['Yes', 'No'],
        defaultId: 1
    })
}

function selectFolder(title, buttonLabel) {
    return dialog.showOpenDialog({
        title: title,
        properties: ['openDirectory'],
        buttonLabel: buttonLabel
    })
}

function selectImage() {
    return dialog.showOpenDialog({
        filters: [{ name : 'Images', extensions: ['jpg', 'png'] }],
        properties: ["openFile"]
    })
}

module.exports = {
    showError: showError,
    showWarning: showWarning,
    askQuestion: askQuestion,
    selectFolder: selectFolder,
    selectImage: selectImage
}