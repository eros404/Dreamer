let scenario
let lastIt = 1000
let currentEpoch = -1

window.api.receive("file-dialog-response", (filePath) => {
    $("#dd-selected-image").attr("src", filePath)
    $("#dd-selected-image").show()
    $("#dd-image-cancel").show()
})
window.api.receive("process-response", (data) => {
    showProcessData(data)
})
window.api.receive("deepdaze-close", (code) => {
    $('#cancel-deepdaze').hide()
    $('#dd-submit').show()
    $("#process-data").hide()
    $("#console").text("Process finished")
    lastIt = 1000
    currentEpoch = -1
})
window.api.receive("deepdaze-installed-response", (code) => {
    if (code == 0) {
        $("#dd-install").hide()
        $("#dd-form-container").show()
    } else {
        $("#dd-install").show()
        $("#dd-form-container").hide()
    }
})
window.api.receive("install-deepdaze-close", (code) => {
    window.api.send("ask-deepdaze-installed")
})

function showProcessData(data) {
    if (data) {
        var matchResult = data.match(/loss:\s(\-?\d+\.\d+):\s+\d+%\|.+\|\s+(\d+)\/\d+\s\[\d+:\d+<\d+:\d+,\s+(.+)]/) // deepdaze output [1]=loss [2]=current iteration [3]=iteration/seconds
        if (!matchResult) {
            matchResult = data.match(/image updated at "\.\/(.+)"/) // image output [1]=image name
            if (!matchResult) {
                $("#console").text(data)
            } else {

            }
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

$(document).ready(function() {
    window.api.send("ask-deepdaze-installed")
    $(".btn-cancel").hide()
    $("#process-data").hide()
    $("#dd-selected-image").hide()

    $("#dd-input-image").on("click", () => {
        window.api.send("file-dialog")
    })
    $("#dd-image-cancel").on("click", () => {
        $("#dd-selected-image").hide()
        $("#dd-selected-image").attr("src", "")
        $("#dd-image-cancel").hide()
    })
    $("#dd-form").off("submit").on("submit", (e) => {
        e.preventDefault()
        scenario = new DeepdazeScenario(
            $("#dd-input-text").val(),
            $("#dd-selected-image").attr("src"),
            $("#dd-input-epochs").val(),
            $("#dd-input-iterations").val(),
            $("#dd-input-save_every").val(),
            $("#dd-input-image_width").val(),
            $("#dd-input-deeper").is(":checked"),
            $("#dd-input-open_forder").is(":checked"),
            $("#dd-input-save_GIF").is(":checked"),
            $("#dd-input-learning-rate").val(),
            $("#dd-input-num-layers").val(),
            $("#dd-input-layer-size").val(),
            $("#dd-input-batch-size").val()
        )
        window.api.send("exec-deepdaze", scenario)
        $('#cancel-deepdaze').show()
        $('#dd-submit').hide()
    })
    $("#cancel-deepdaze").off('click').on("click", () => {
        window.api.send("cancel-current-process")
    })
    $("#install-deepdaze").on("click", () => {
        window.api.send("install-deepdaze")
    })
    $("#dd-input-deeper").on("change", function() {
        if ($("#dd-input-deeper").prop("checked")) {
            $("#dd-input-num-layers").val(32)
        }
    })
    $("#dd-input-num-layers").on("change", function() {
        if ($("#dd-input-num-layers").val() == 32) {
            $("#dd-input-deeper").prop("checked", true)
        } else {
            $("#dd-input-deeper").prop("checked", false)
        }
    })
})