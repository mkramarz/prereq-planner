function get_reqs(doc) {
    let list = doc.getElementsByClassName("catalog-notes")[0];
    let bullets = list.getElementsByTagName("li");
    const reqs = [[],[]] //First array for prereqs, second array for coreqs

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

}