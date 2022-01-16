import('./course.js')
.then((Module) => {

    let groupNum = 1;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === "fetch") {
            groupNum = 1;
            getReqs(document)
            .then((res) => {
                console.log(res);
                sendResponse(res);
            });
        }
        return true;
    });

    

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
                prereqs = await logicParse(bullet.childNodes[0]);
            }
            else if (text.includes("Corequisite:") || text.includes("Corequisites:") || text.includes("Corequisite(s):")) {
                coreqs = await logicParse(bullet.childNodes[0]);
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

    async function logicParse(node) {
        let links = node.getElementsByTagName("a");
        let text = node.innerHTML;
        let reqs = []
        if (links.length == 0 || typeof node == "undefined") {
            //console.log("No links to follow");
            return [];
        }

        if (links.length == 1) {
            return [await parseChild(links[0])];
        }

        //Prepare the text by converting into a sequence of symbols rather than natural language
        text = text.match(/(<.*>\)?)/g)[0];
        for (let i = 0; i < links.length; i++) {
            text = text.replace(/<[^>]*>[^><]*<\/[^>]>/, i.toString());
        }
        text = text.replace(/and/g, ",");
        text = text.replace(/or/g, "/");
        text = text.replace(/ /g, "");
        text = text.replace(/\(/g, "")
        text = text.replace(/\)/g, "")
        text = text.replace(/([^0-9,\/])/g, "");
        text = text + "."

        console.log(text);

        let grouping = -1;
        for (let i = 0; i < text.length-1; i++) {
            let char = text[i];
            if (isNaN(char)) {
                if (char == ",") { //Conjunction operator
                    grouping = -1;
                }
            }
            else { //If we are on a link alias
                if (grouping == -1 && text[i+1] == '/') {
                    grouping = groupNum;
                    groupNum++;
                }
                console.log(links[parseInt(text[i])].href + " in group " + grouping);
                reqs.push(await parseChild(links[parseInt(text[i])].href, grouping));
            }
        }
        return reqs;
    }
});