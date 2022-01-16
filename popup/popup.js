import {Course} from '../course.js';

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {message: "fetch"}, function(res) {
		populateList(res, document.getElementById("list"), false);
	});
});


function populateList(course, parentList, isCoreq){
  let item = document.createElement("li");
  if(!isCoreq)
  {    
    if(course.group!=-1)
      item.innerHTML= course.name + "<sup>" +course.group + "</sup>";
    else
      item.innerText = course.name;
  }
  else
  {
    if(course.group!=-1)
      item.innerHTML = course.name + " [Corequisite]<sup>" + course.group + "</sup>"; 
    else
      item.innerText = course.name + " [Corequisite]";
  }
  parentList.appendChild(item);

  if (course.prereqs.length!=0){
    let prereqs = course.prereqs; 
    let subList = document.createElement("ul");
    parentList.appendChild(subList);

    prereqs.forEach((item)=>{
      let subItem = document.createElement("li");
      if(item.group!=-1)
        subItem.innerHTML = item.name + "<sup>" + item.group + "</sup>";
      else
        subItem.innerText = item.name;
      subList.appendChild(subItem);

      if (item.prereqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        item.prereqs.forEach((item)=>{
          populateList(item, subList1, false);
        })
      }
      if (item.coreqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        item.coreqs.forEach((item)=>{
          populateList(item, subList1, true);
        })
      }
    })
  }


  if (course.coreqs.length!=0){
    let coreqs = course.coreqs; 
    let subList = document.createElement("ul");
    parentList.appendChild(subList);

    coreqs.forEach((item)=>{
      let subItem = document.createElement("li");
      if(item.group!=-1)
        subItem.innerHTML = item.name + "[Corequisite]<sup>" + item.group + "</sup>";
      else
        subItem.innerText = item.name + " [Corequisite]";
      subList.appendChild(subItem);

      if (item.prereqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        item.prereqs.forEach((item)=>{
          populateList(item, subList1, false);
        })
      }
      if (item.coreqs.length!=0){
        let subList1 = document.createElement("ul");
        subList.appendChild(subList1);
        item.coreqs.forEach((item)=>{
          populateList(item, subList1, true);
        })
      }
    })
  }
}
