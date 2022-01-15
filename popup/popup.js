document.onload(() => {
    window.postMessage("fetch")
})

window.addEventListener("message", (event) => {
    if (event.source != window) {
        return;
    }
    //TODO: What to do when recieving the courses back
})