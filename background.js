import('./course.js')
.then((Module) => {

    let groupNum = 1;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // This handles listening for the extension's message to begin, and responding with the courses
        if (request.message === "fetch") {
            groupNum = 1; // Remember to reset group number every time the script runs!
            getReqs(document)
            .then((res) => {
                sendResponse(res);
            });
        }
        return true; // Returning true here prevents the port from closing prematurely
    });

    async function getReqs(doc, group=-1) {
        // Reference variables
        let code = doc.getElementById("page-title").innerText.trim().slice(0,8);
        let list;
        if (doc.getElementsByClassName("catalog-notes").length == 0) {
            return new Module.Course(code, [], [], group); //If there's no catalog section, return empty course
        }
        else {
            list = doc.getElementsByClassName("catalog-notes")[0];
        } 
        let bullets = list.getElementsByTagName("li");
        let prereqs = [];
        let coreqs = [];

        // For each bullet, check if its the prerequisite or corequisite bullet
        for (let bullet of bullets) {
            let text = bullet.childNodes[0].innerHTML
            if (text.includes("Prerequisite:") || text.includes("Prerequisites:") || text.includes("Prerequisite(s):")) {
                prereqs = await logicParse(bullet.childNodes[0]); // Parse all links
            }
            else if (text.includes("Corequisite:") || text.includes("Corequisites:") || text.includes("Corequisite(s):")) {
                coreqs = await logicParse(bullet.childNodes[0]); // Same here
            }
        }
        return new Module.Course(code, prereqs, coreqs, group); // Finally, return a course with the data
    }

    async function logicParse(node) {
        let links = node.getElementsByTagName("a");
        let text = node.innerHTML;
        let reqs = []

        //Handle our base cases first
        if (links.length == 0 || typeof node == "undefined") {
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

        //Now, iterate through the sequence we created
        //If an alias is followed by a slash (disjunction), we enable grouping
        //Then, we disable grouping if we come across a comma (conjunction)
        let grouping = -1;
        for (let i = 0; i < text.length-1; i++) {
            let char = text[i];
            if (isNaN(char)) {
                if (char == ",") { //Conjunction operator
                    grouping = -1;
                }
            }
            else { //If we are on a link alias
                if (grouping == -1 && text[i+1] == '/') { //Disjunction operator
                    grouping = groupNum;
                    groupNum++;
                }
                // Add the corresponding link in our listing
                reqs.push(await parseChild(links[parseInt(text[i])].href, grouping));
            }
        }
        return reqs;
    }

    async function parseChild(url, group=-1) {
        // Fetching is async, which is why every other function is async too
        let result = await fetch(url);
        let text = await result.text()
        // Turn our fetched HTML page into a new DOM
        const doc = new DOMParser().parseFromString(text, 'text/html');
        // Then recursively parse that new DOM
        let reqResult = getReqs(doc, group);
        return reqResult;
    }
});