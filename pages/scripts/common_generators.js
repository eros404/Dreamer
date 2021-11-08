window.api.receive("user-files-path-response", (response) => {
    $("#dreamer-output-path").text(response.path)
    if (!response.isValid) {
        $("#open-collection").hide()
    } else {
        $("#open-collection").show()
    }
})

$("#generator_main").load(`./${page}.html`)

$("#choose-dreamer-output-path").off('click').on("click", () => {
    window.api.send("change-user-files-path")
})
$("#open-collection").off("click").on("click", () => {
    window.api.send("open-image-collection")
})

loadScript(`./scripts/${page}.js`)