const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["exec-deepdaze", "cancel-deepdaze", "file-dialog", "ask-deepdaze-installed", "install-deepdaze"]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = ["process-response", "deepdaze-close", "file-dialog-response", "deepdaze-installed-response", "install-deepdaze-close"]
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)