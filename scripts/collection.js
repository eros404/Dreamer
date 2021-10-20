let upscaledFileOutput

$(document).ready(function() {
    $("#realsr-modal").hide()
    $("#generator_input").on("change", () => {  
        window.api.send("ask-output-file-tree", $("#generator_input").val())
    })
    $(".realsr-modal-close").on("click", () => {
        $("#realsr-modal").hide()
    })
    $("#realsr-form").on("submit", (e) => {
        e.preventDefault()
        var scenario = new RealsrScenario(
            $("#realsr-image").attr("src"),
            $("#realsr-input-overwrite").is(":checked"),
            $("#realsr-input-tta").is(":checked")
        )
        upscaledFileOutput = scenario.outputPath
        window.api.send("exec-realsr", scenario)
    })
})

function idFriendly(text) {
    return text.replace(/[^a-z0-9_\-]/gi, "-")
}

function fillWithImages(container, images) {
    for (const image of images) {
        var newDiv = $("<div id='" + idFriendly(image.path) + "'></div>")
        newDiv.html($("#image-template").html())
        newDiv.find(".image-dimensions").text(image.dimensions.width + "x" + image.dimensions.height)
        newDiv.find(".image-size").text(image.size)
        let imageElmt = newDiv.find(".image")
        imageElmt.attr("src", image.path)
        imageElmt.attr("title", image.name)
        if (image.path.match(/[\.jpg|\.png]$/)) {
            imageElmt.on("click", () => {
                $("#realsr-image").attr("src", image.path)
                $("#realsr-modal").show()
            })
        } else {
            imageElmt.removeClass("cursor-pointer")
        }
        newDiv.find(".image-delete").on("click", () => {
            window.api.send("delete-image", image.path)
        })
        container.append(newDiv)
    }
}

window.api.receive("output-file-tree-response", (response) => {
    $("#collection").html("")
    for (const folder of response) {
        var newDiv = $("<div id='" + idFriendly(folder.path) + "'></div>")
        newDiv.html($("#dir-template").html())
        let dirName = newDiv.find(".dir-name")
        let dirContent = newDiv.find(".dir-content")
        let matchName = folder.name.match(/^(\d+)-(\d+)-(\d+)_(\d+)_(\d+)_\d+_\d+_(\w+)$/) // 1->year 2->month 3->day 4->hour 5->minutes 6->name
        newDiv.find(".dir-datetime").text([matchName[1], matchName[2], matchName[3]].join("/") + " " + [matchName[4], matchName[5]].join(":"))
        newDiv.find(".dir-delete").on("click", () => {
            window.api.send("delete-folder", folder.path)
        })
        newDiv.find(".dir-open").on("click", () => {
            window.api.send("shell-open-path", folder.path)
        })
        dirName.text(matchName[6].replaceAll("_", " "))
        dirContent.hide()
        dirName.on("click", () => {
            dirName.toggleClass("active")
            dirContent.slideToggle()
        })
        fillWithImages(dirContent, folder.images)
        $("#collection").prepend(newDiv)
    }
})

window.api.receive("element-deleted", (path) => {
    $("#" + idFriendly(path)).remove()
})

window.api.receive("user-files-path-response", (response) => {
    $("#dreamer-output-path").text(response.path)
    if (!response.isValid) {
        $("#collection-container").hide()
    } else {
        window.api.send("ask-output-file-tree", $("#generator_input").val())
        $("#collection-container").show()
    }
})

window.api.receive("process-response", (data) => {
    $("#console").text(data.output)
})
window.api.receive("exec-realsr-close", (code) => {
    if (code == 0) {
        window.api.send("ask-image-info", upscaledFileOutput)
        $("#realsr-modal").hide()
        $("#console").text("")
    }
})
window.api.receive("image-info-response", (image) => {
    fillWithImages($("#" + idFriendly(image.rootDir)).find(".dir-content"), [image])
})