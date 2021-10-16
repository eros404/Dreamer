$(document).ready(function() {
    window.api.send("ask-output-file-tree")
})

function displayFolderContent(container, images, folders) {
    for (const folder of folders) {
        displayFolder(folder, container)
    }
    container.show()
}
function displayFolder(rootFolder, container) {
    var clone = $("#dir-template").html()
    var newDiv = $("<div></div>")
    newDiv.html(clone)
    newDiv.find(".dir-name").text(rootFolder.name)
    newDiv.find(".dir-content").hide()
    newDiv.find(".dir-name").on("click", () => {
        newDiv.find(".dir-name").toggleClass("active")
        displayFolderContent(newDiv.find(".dir-content"), rootFolder.images, rootFolder.folders)
    })
    container.append(newDiv)
}

window.api.receive("output-file-tree-response", (response) => {
    displayFolder(response, $("#collection"))
})