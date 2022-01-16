document.getElementById("sendMessage").addEventListener("click", () => {
    window.postMessage("fetch");
    console.log("Msg sent");
})

window.addEventListener("message", (event) => {
    if (event.source != window) {
        return;
    }
    console.log(event.data);
    //TODO: What to do when recieving the courses back
})