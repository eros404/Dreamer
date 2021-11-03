const Store = require('electron-store');

const shema = {
    userImagesPath: {
        type: 'string',
        default: 'none'
    }
}

const store = new Store({shema});

function getUserImagesPath() {
    return (store.get('userImagesPath')) ? store.get('userImagesPath') : "none"
}
function setUserImagesPath(newPath) {
    store.set('userImagesPath', newPath)
}

module.exports = {
    getUserImagesPath: getUserImagesPath,
    setUserImagesPath: setUserImagesPath
}