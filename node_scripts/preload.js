const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = [
                "exec-deepdaze",
                "cancel-current-process",
                "file-dialog", 
                "ask-deepdaze-installed",
                "install-deepdaze",
                "ask-user-files-path",
                "changeOutputPath",
                "install-CUDA-Windows",
                "install-CUDA-Linux"
            ]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = [
                "process-response",
                "deepdaze-close",
                "file-dialog-response",
                "deepdaze-installed-response",
                "install-deepdaze-close",
                "user-files-path-response"
            ]
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)