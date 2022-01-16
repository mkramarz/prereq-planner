import Course from '../course.js';

get_reqs(document).then((res) => {
    console.log(res);
});

async function get_reqs(doc) {
    let list = doc.getElementsByClassName("catalog-notes")[0];
    let bullets = list.getElementsByTagName("li");
    let code = doc.getElementById("page-title").innerText.trim().slice(0,8);
    let prereqs = [];
    let coreqs = [];
    console.log("Found " + code);

    for (let bullet of bullets) {
        let text = bullet.childNodes[0].innerHTML
        if (text.includes("Prerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
            prereqs = await parse_reqs(bullet.childNodes[0]);
        }
        else if (text.includes("Corequisite:") || text.includes("Corequisites:") || text.includes("Corequisite(s):")) {
            coreqs = await parse_reqs(bullet.childNodes[0]);
        }
    }
    return new Course(code, prereqs, coreqs);
}

async function parse_reqs(node) {
    let links = node.getElementsByTagName("a");
    let reqs = []
    if (links.length == 0) {
        console.log("No links to follow");
    }
    for (let link of links) {
        console.log("Following link to " + link.innerText);
        reqs.push(await parse_child(link.href));
    }
    return reqs
}

async function parse_child(url) {
    let result = await fetch(url);
    let text = await result.text()
    const doc = new DOMParser().parseFromString(text, 'text/html');
    let reqResult = get_reqs(doc);
    return reqResult;
}