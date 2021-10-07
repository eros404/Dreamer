window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("test").addEventListener("click", () => {
        let Command = {
            cmdName: "imagine",
            cmdArgs: ["love", "--epochs=1", "--image_width=100"],
            cmdCallback: null
        }
        window.api.send("exec-command", Command)
    })
})