window.addEventListener('DOMContentLoaded', () => {
    $(".btn-cancel").hide()
    $("#dd-input-image").on("click", () => {
        window.api.send("file-dialog")
    })
    window.api.receive("file-dialog-response", (filePath) => {
        $("#dd-image-path").text(filePath)
        $("#dd-image-cancel").show()
    })
    $("#dd-image-cancel").on("click", () => {
        $("#dd-image-path").text("")
        $("#dd-image-cancel").hide()
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
        $('#cancel-deepdaze').show()
        $('#dd-submit').hide()
    })
    $("#cancel-deepdaze").on("click", () => {
        window.api.send("cancel-deepdaze")
    })
    window.api.receive("deepdaze-response", (data) => {
        $("#console").text(data)
    })
    window.api.receive("deepdaze-close", (code) => {
        $('#cancel-deepdaze').hide()
        $('#dd-submit').show()
        $("#console").text("Process finished with the exit code: " + code)
    })
})