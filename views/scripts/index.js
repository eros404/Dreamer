window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("test").addEventListener("click", () => {
        let Command = {
            cmdName: "imagine",
            cmdArgs: ["love", "--epochs=1", "--image_width=100", "--iterations=100"],
            cmdCallback: null
        }
        window.api.send("exec-deepdaze", Command)
    })
})
window.api.receive("deepdaze-response", (data) => {
    document.getElementById("console").innerText = data
})