import {Course} from '../course.js';

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {message: "fetch"}, function(res) {
		populateList(res, document.getElementById("list"));
	});
});


function populateList(course, parentList){
  let item = document.createElement("li");
  if(course.group!=-1)
    item.innerHTML= course.name + "<sup>" +course.group + "</sup>";
  else
    item.innerText = course.name;
  parentList.appendChild(item);

  if (course.prereqs.length!=0){
    let prereqs = course.prereqs; 
    let subList = document.createElement("ul");
    parentList.appendChild(subList);

    prereqs.forEach((item)=>{
      if (item.prereqs.length!=0)
        populateList(item, subList)
      else
      {
        let subItem = document.createElement("li");
        if(item.group!=-1)
          subItem.innerHTML = item.name + "<sup>" + item.group + "</sup>";
        else
          subItem.innerText = item.name;
        subList.appendChild(subItem);
      }
    })

    if (course.coreqs.length!=0){
      let prereqs = course.coreqs; 
  
      prereqs.forEach((item)=>{
        if (item.coreqs.length!=0)
          populateList(item, subList)
        else
        {
          let parentItem = document.createElement("li");
          if(item.group!=-1)
            parentItem.innerHTML = item.name + " [Corequisite]<sup>" + item.group + "</sup>";
          else
            parentItem.innerText = item.name +" [Corequisite]";
          parentList.appendChild(parentItem);
        }
      })
    }
  }
}
