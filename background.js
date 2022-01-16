var port = chrome.runtime.connect();

class Course {
    constructor(name, prereqs, coreqs) {
        this.name = name;
        this.prereqs = prereqs;
        this.coreqs = coreqs;
    }
    getPrereqs() {
        return this.prereqs;
    }
    getCoreqs() {
        return this.coreqs;
    }
    getName(){
        return this.name;
    }
  }

classes = get_reqs(document);
console.log(classes)

function get_reqs(doc) {
    let list = doc.getElementsByClassName("catalog-notes")[0];
    let bullets = list.getElementsByTagName("li");
    let code = doc.getElementById("page-title").innerText.trim().slice(0,8);
    let prereqs = [];
    let coreqs = [];
    console.log("Found " + code);

    for (let bullet of bullets) {
        let text = bullet.childNodes[0].innerHTML
        if (text.includes("Prerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
            prereqs = parse_reqs(bullet.childNodes[0]);
        }
        else if (text.includes("Corequisite:") || text.includes("Corequisites:") || text.includes("Corequisite(s):")) {
            coreqs = parse_reqs(bullet.childNodes[0]);
        }
    }
    return new Course(code, prereqs, coreqs);
}

function parse_reqs(node) {
    let links = node.getElementsByTagName("a");
    let reqs = []
    if (links.length == 0) {
        console.log("No links to follow");
    }
    for (let link of links) {
        console.log("Following link to " + link.innerText);
        reqs.push(parse_child(link.href));
    }
    return reqs
}

function parse_child(url) {
    fetch(url)
    .then((res) => res.text())
    .then((text) => {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return get_reqs(doc);
    })
    .catch((err) => {
        console.log("Encountered an error: " + err);
    });
}