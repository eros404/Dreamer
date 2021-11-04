$(document).ready(function() {
    $("#realsr-modal").hide()
    $("#image-modal").hide()
    $("#generator_input").off("change").on("change", () => {  
        window.api.send("ask-output-file-tree", $("#generator_input").val())
    })
    $(".realsr-modal-close").off("click").on("click", () => {
        $("#realsr-modal").hide()
    })
    $(".image-modal-close").off("click").on("click", () => {
        $("#image-modal").hide()
    })
    $("#realsr-form").off("submit").on("submit", (e) => {
        e.preventDefault()
        var scenario = new RealsrScenario(
            $("#realsr-image").attr("src"),
            // $("#realsr-input-overwrite").is(":checked"),
            false,
            $("#realsr-input-tta").is(":checked")
        )
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
        imageElmt.on("click", () => {
            $("#modal-image-name").text(image.name)
            $("#image-modal-image").attr("src", image.path)
            $("#image-modal").show()
        })
        if (image.path.match(/[\.jpg|\.png]$/)) {
            newDiv.find(".open-realsr").on("click", () => {
                $("#realsr-image").attr("src", image.path)
                $("#realsr-modal").show()
            })
        } else {
            newDiv.find(".open-realsr").hide()
        }
        newDiv.find(".image-delete").on("click", () => {
            window.api.send("delete-image", image.path)
        })
        for (const child of container.children()) {

            if (idFriendly(image.path).localeCompare(idFriendly($(child).attr("id"))) < 0) {
                console.log("pass :\n" + image.path)
                newDiv.insertBefore($(child))
                break
            }
        }
        if (container.find("#" + idFriendly(image.path)).length == 0) {
            console.log(" not pass :\n" + image.path)
            container.append(newDiv)
        }
    }
}

window.api.receive("output-file-tree-response", (response) => {
    $("#collection").html("")
    for (const folder of response) {
        let matchName = folder.name.match(/^(\d+)-(\d+)-(\d+)_(\d+)_(\d+)_\d+_\d+_(\w+)$/) // 1->year 2->month 3->day 4->hour 5->minutes 6->name
        if (!matchName) { continue }

        var newDiv = $("<div id='" + idFriendly(folder.path) + "'></div>")
        newDiv.html($("#dir-template").html())
        let dirName = newDiv.find(".dir-name")
        let dirContent = newDiv.find(".dir-content")
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

let updateConsole = true
window.api.receive("process-response", (data) => {
    if (updateConsole) {
        $("#console").text(data.output)
    } else {
        $("#console").text($("#console").text() + data.output)
    }
    updateConsole = data.output.includes("%")
})
window.api.receive("exec-realsr-close", (code) => {
    if (code == 0) {
        $("#realsr-modal").hide()
        $("#console").text("")
    }
})
window.api.receive("image-added", (image) => {
    fillWithImages($("#" + idFriendly(image.rootDir)).find(".dir-content"), [image])
})