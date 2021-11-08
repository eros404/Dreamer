function loadScript(src) {
    var s = document.createElement("script")
    s.src = src
    document.head.appendChild(s)
}

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

let page = new URLSearchParams(window.location.search).get("page")
$(document).ready(function() {
    if (page == "collection") {
        $("#app").load("./collection.html")
        loadScript("./scripts/collection.js")
    } else {
        $("#app").load("./_layout_generators.html")
        loadScript("./scripts/common_generators.js")
    }

    window.api.send("ask-user-files-path")
    $("#choose-dreamer-output-path").off('click').on("click", () => {
        window.api.send("change-user-files-path")
    })
})