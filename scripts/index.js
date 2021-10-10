window.addEventListener('DOMContentLoaded', () => {

    $("#dd-input-image").on("click", () => {
        window.api.send("file-dialog")
    })
    window.api.receive("file-dialog-response", (filePath) => {
        $("#dd-image-path").text(filePath)
        $("#dd-image-cancel").prop("disabled", false)
    })
    $("#dd-image-cancel").on("click", () => {
        $("#dd-image-path").text("")
        $("#dd-image-cancel").prop("disabled", true)
    })


    $("#dd-form").on("submit", (e) => {
        e.preventDefault()
        console.log($("#dd-input-image").val())
        let scenario = new DeepdazeScenario(
            $("#dd-input-text").val(),
            $("#dd-image-path").text(),
            $("#dd-input-epochs").val(),
            $("#dd-input-iterations").val(),
            $("#dd-input-save_every").val(),
            $("#dd-input-image_width").val(),
            $("#dd-input-deeper").is(":checked"),
            $("#dd-input-open_forder").is(":checked"),
            $("#dd-input-save_GIF").is(":checked"),
        )
        window.api.send("exec-deepdaze", scenario)
        $('#cancel-deepdaze').prop("disabled", false)
        $('#dd-submit').prop("disabled", true)
    })
    $("#cancel-deepdaze").on("click", () => {
        window.api.send("cancel-deepdaze")
    })
    window.api.receive("deepdaze-response", (data) => {
        $("#console").text(data)
    })
    window.api.receive("deepdaze-close", (code) => {
        $('#cancel-deepdaze').prop("disabled", true)
        $('#dd-submit').prop("disabled", false)
        $("#console").text("Process finished with the exit code: " + code)
    })
})