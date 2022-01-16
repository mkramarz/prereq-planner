import {Course} from '../course.js';

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {message: "fetch"}, function(res) {
		populateList(res, document.getElementById("list"), false);
	});
});


function populateList(course, parentList, isCoreq){
  let item = document.createElement("li"); // create new list item
  if(!isCoreq) // check if the current course is a corequisite
  {    
    if(course.group!=-1) // check if course has an "OR"
      item.innerHTML= course.name + "<sup>" +course.group + "</sup>";
    else
      item.innerText = course.name;
  }
  else
  {
    if(course.group!=-1) // check if course has an "OR"
      item.innerHTML = course.name + " [Corequisite]<sup>" + course.group + "</sup>"; 
    else
      item.innerText = course.name + " [Corequisite]";
  }
  parentList.appendChild(item);

	if (course.prereqs.length!=0){
		let prereqs = course.prereqs; 
		let subList = document.createElement("ul"); // create sublist (indent)
		parentList.appendChild(subList);

    // loop through each prerequisite
    prereqs.forEach((item)=>{
      let subItem = document.createElement("li");
      if(item.group!=-1) // check if course has an "OR"
        subItem.innerHTML = item.name + "<sup>" + item.group + "</sup>";
      else
        subItem.innerText = item.name;
      subList.appendChild(subItem);

      // check if course has prerequisite(s)
      if (item.prereqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        // add each prerequisite to the list recursively
        item.prereqs.forEach((item)=>{
          populateList(item, subList1, false);
        })
      }
      // check if course has corequisite(s)
      if (item.coreqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        // add each corequisite to the list recursively
        item.coreqs.forEach((item)=>{
          populateList(item, subList1, true);
        })
      }
    })
  }

  if (course.coreqs.length!=0){
    let coreqs = course.coreqs; 
    let subList = document.createElement("ul"); // create sublist (indent)
    parentList.appendChild(subList);

    // loop through each corequisite
    coreqs.forEach((item)=>{
      let subItem = document.createElement("li");
      if(item.group!=-1) // check if course has an "OR"
        subItem.innerHTML = item.name + "[Corequisite]<sup>" + item.group + "</sup>";
      else
        subItem.innerText = item.name + " [Corequisite]";
      subList.appendChild(subItem);

      // check if course has prerequisite(s)
      if (item.prereqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        // add each prerequisite to the list recursively
        item.prereqs.forEach((item)=>{
          populateList(item, subList1, false);
        })
      }
      // check if course has corequisite(s)
      if (item.coreqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        // add each corequisite to the list recursively
        item.coreqs.forEach((item)=>{
          populateList(item, subList1, true);
        })
      }
    })
  }
}
