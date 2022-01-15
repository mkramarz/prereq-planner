function get_reqs(doc) {
    let list = doc.getElementsByClassName("catalog-notes")[0];
    let bullets = list.getElementsByTagName("li");

    for (let bullet of bullets) {
        let text = bullet.childNodes[0].innerHTML
        if (text.includes("Prerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
            parse_reqs(bullet.childNodes[0]);
        }
        else if (text.includes("Coerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
            parse_reqs(bullet.childNodes[0]);
        }
    }
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