window.addEventListener('DOMContentLoaded', () => {
    let console = $("#console")
    $("#dd-form").on("submit", () => {
        let scenario = new DeepdazeScenario(
            $("#dd-input-text").val(),
            $("#dd-input-epochs").val(),
            $("#dd-input-iterations").val(),
            $("#dd-input-save_every").val(),
            $("#dd-input-image_width").val(),
            $("#dd-input-deeper").val(),
            $("#dd-input-open_forder").val(),
            $("#dd-input-save_GIF").val(),
        )
        window.api.send("exec-deepdaze", scenario)
        $('#cancel-deepdaze').disabled = false
    })
    $("#cancel-deepdaze").on("click", () => {
        window.api.send("cancel-deepdaze")
    })
    window.api.receive("deepdaze-response", (data) => {
        console.innerText = data
    })
    window.api.receive("deepdaze-close", (code) => {
        $('#cancel-deepdaze').disabled = true
        console.innerText = "Process finished with the exit code: " + code
    })
})