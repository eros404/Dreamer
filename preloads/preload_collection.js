const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = [
                "ask-output-file-tree",
                "ask-user-files-path",
                "change-user-files-path",
                "delete-folder",
                "delete-image",
                "exec-realsr",
                "shell-open-path"
            ]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = [
                "output-file-tree-response",
                "user-files-path-response",
                "element-deleted",
                "process-response",
                "exec-realsr-close",
                "image-added"
            ]
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)