const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["exec-deepdaze", "cancel-deepdaze", "file-dialog"]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = ["deepdaze-response", "deepdaze-close", "file-dialog-response"]
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)