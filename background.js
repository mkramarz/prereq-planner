window.addEventListener("message", (event) => {
    if (event.source != window) {
        return;
    }
    if (event.data.text == "fetch") {
        let classes = get_reqs(document);
        window.postMessage(classes);
    }
});

function get_reqs(doc) {
    let list = doc.getElementsByClassName("catalog-notes")[0];
    let bullets = list.getElementsByTagName("li");
    let code = doc.getElementById("page-title").innerText.slice(0,8);
    const prereqs = [];
    const coreqs = [];

    for (let bullet of bullets) {
        let text = bullet.childNodes[0].innerHTML
        if (text.includes("Prerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
            prereqs = parse_reqs(bullet.childNodes[0]);
        }
        else if (text.includes("Coerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
            coreqs = parse_reqs(bullet.childNodes[0]);
        }
    }
    return new Course(code, prereqs, coreqs);
}

function parse_reqs(node) {
    let links = node.getElementsByTagName("a");
    for (let link of links) {
        parse_child(link.href)
    }
}

function parse_child(url) {
    fetch(url)
    .then((res) => res.text())
    .then((text) => {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        get_reqs(doc);
    })
    .catch((err) => {
        console.log("Encountered an error: " + err);
    });
}