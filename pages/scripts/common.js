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
    window.api.send("ask-user-files-path")
    $("#choose-dreamer-output-path").off('click').on("click", () => {
        window.api.send("change-user-files-path")
    })
})