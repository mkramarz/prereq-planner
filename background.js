function get_reqs() {
    let list = document.getElementsByClassName("catalog-notes")[0];
    let bullets = list.getElementsByTagName("li");
    const reqs = [[],[]] //First array for prereqs, second array for coreqs

    for (let bullet of bullets) {
        let text = bullet.childNodes[0].innerHTML
        if (text.includes("Prerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
            parse_reqs(bullet.childNodes[0]);
        }
        else if (text.includes("Coerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):") {

        }
    }
}

function parse_reqs(node) {
    links = node.getElementsByTagName('a');
}