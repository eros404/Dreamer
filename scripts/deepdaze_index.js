let scenario
let lastIt = 1000
let currentEpoch = -1
let lastScenarioImageDirectory

window.api.receive("file-dialog-response", (filePath) => {
    $("#dd-selected-image").attr("src", filePath)
    $("#dd-selected-image").show()
    $("#dd-image-cancel").show()
})
window.api.receive("process-response", (data) => {
    if (data && data.output) {
        var matchResult = data.output.match(/loss:\s(\-?\d+\.\d+):\s+\d+%\|.+\|\s+(\d+)\/\d+\s\[\d+:\d+<\d+:\d+,\s+(.+)]/) // deepdaze output [1]=loss [2]=current iteration [3]=iteration/seconds
        if (!matchResult) {
            matchResult = data.output.match(/image updated at "\.\/(.+)"/) // image output [1]=image name
            if (!matchResult) {
                $("#console").text(data.output)
            } else {
                $("#dd-output-image").attr("src", data.imageDirectoryPath.replace("__IMAGENAME__", matchResult[1]))
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
window.api.receive("user-files-path-response", (response) => {
    $("#dreamer-output-path").text(response.path)
    if (!response.isValid) {
        $("#dreamer-output-path").addClass("text-red")
        $("#dreamer-output-path").removeClass("text-green")
        $("#dd-submit").prop("disabled", true)
        $("#output-directory-warning").show()
    } else {
        $("#dreamer-output-path").addClass("text-green")
        $("#dreamer-output-path").removeClass("text-red")
        $("#dd-submit").prop("disabled", false)
        $("#output-directory-warning").hide()
    }
})

$(document).ready(function() {
    window.api.send("ask-deepdaze-installed")
    window.api.send("ask-user-files-path")
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
    let stock_numLayers
    $("#dd-input-deeper").on("change", function() {
        if ($("#dd-input-deeper").prop("checked")) {
            stock_numLayers = $("#dd-input-num-layers").val()
            $("#dd-input-num-layers").val(32)
        } else {
            $("#dd-input-num-layers").val(stock_numLayers)
        }
    })
    $("#dd-input-num-layers").on("change", function() {
        stock_numLayers = $("#dd-input-num-layers").val()
        if ($("#dd-input-num-layers").val() == 32) {
            $("#dd-input-deeper").prop("checked", true)
        } else {
            $("#dd-input-deeper").prop("checked", false)
        }
    })
    $("#choose-dreamer-output-path").on("click", () => {
        window.api.send("changeOutputPath")
    })
})