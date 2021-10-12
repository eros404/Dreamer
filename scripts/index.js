let scenario
let lastIt = 1000
let currentEpoch = -1

window.api.receive("file-dialog-response", (filePath) => {
    $("#dd-image-path").text(filePath)
    $("#dd-image-cancel").show()
})
window.api.receive("deepdaze-response", (data) => {
    showProcessData(data)
})
window.api.receive("deepdaze-close", (code) => {
    $('#cancel-deepdaze').hide()
    $('#dd-submit').show()
    $("#console").text("Process finished")
    lastIt = 1000
    currentEpoch = -1
})

function showProcessData(data) {
    if (data) {
        var matchResult = data.match(/loss:\s(\-?\d+\.\d+):\s+\d+%\|.+\|\s+(\d+)\/\d+\s\[\d+:\d+<\d+:\d+,\s+(\d+\.\d+it\/s)]/) // deepdaze output [1]=loss [2]=current iteration [3]=iteration/seconds
        if (!matchResult) {
            $("#console").text(data)
        } else {
            var currentIt = parseInt(matchResult[2])
            var epochProgression = currentIt / parseInt(scenario.iterations) * 100
            $("#process-loss").text(matchResult[1])
            $("#data-progress-bar").width(epochProgression + "%")
            if (currentIt < lastIt) {
                currentEpoch++
                $("#process-current-epoch").text(currentEpoch)
            }
            $("#process-total-epochs").text(scenario.epochs)
            $("#process-it-second").text(matchResult[3])
            $("#process-data").show()
            lastIt = currentIt
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    $(".btn-cancel").hide()
    $("#process-data").hide()

    $("#dd-input-image").on("click", () => {
        window.api.send("file-dialog")
    })
    $("#dd-image-cancel").on("click", () => {
        $("#dd-image-path").text("")
        $("#dd-image-cancel").hide()
    })
    $("#dd-form").on("submit", (e) => {
        e.preventDefault()
        scenario = new DeepdazeScenario(
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
})