import('./course.js')
.then((Module) => {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === "fetch") {
            getReqs(document)
            .then((res) => {
                console.log(res);
                sendResponse(res);
            });
        }
        return true;
    });

    let groupNum = 0;

    async function getReqs(doc, group=-1) {
        let list = doc.getElementsByClassName("catalog-notes")[0];
        let bullets = list.getElementsByTagName("li");
        let code = doc.getElementById("page-title").innerText.trim().slice(0,8);
        let prereqs = [];
        let coreqs = [];
        //console.log("Found " + code);

        for (let bullet of bullets) {
            let text = bullet.childNodes[0].innerHTML
            if (text.includes("Prerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
                // console.log(logicParse(bullet.childNodes[0]));
                prereqs = await parseReqs(bullet.childNodes[0]);
            }
            else if (text.includes("Corequisite:") || text.includes("Corequisites:") || text.includes("Corequisite(s):")) {
                // console.log(logicParse(bullet.childNodes[0]));
                coreqs = await parseReqs(bullet.childNodes[0]);
            }
        }
        return new Module.Course(code, prereqs, coreqs, group);
    }

    async function parseReqs(node) {
        let links = node.getElementsByTagName("a");
        let reqs = []
        if (links.length == 0) {
            //console.log("No links to follow");
        }
        for (let link of links) {
            //console.log("Following link to " + link.innerText);
            reqs.push(await parseChild(link.href));
        }
        return reqs
    }

    async function parseChild(url, group=-1) {
        let result = await fetch(url);
        let text = await result.text()
        const doc = new DOMParser().parseFromString(text, 'text/html');
        let reqResult = getReqs(doc, group);
        return reqResult;
    }

    // function logicParse(node) {
    //     let links = node.getElementsByTagName("a");
    //     let text = node.innerHTML;
    //     let reqs = []
    //     if (links.length == 0) {
    //         console.log("No links to follow");
    //         return reqs;
    //     }
    //     console.log(text)
    //     console.log(text.match(/(<.*>\)?)/g))
    //     text = text.match(/(<.*>\)?)/g)[0];
    //     text = text.replace(" and ", ",");
    //     for (let i = 0; i < links.length; i++) {
    //         text.replace(/<[^>]*>[^><]*<\/[^>]>/g, i.toString());
    //     }
    //     return text;
    // }

});