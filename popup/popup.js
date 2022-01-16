class Course {
  constructor(name, prereqs, coreqs, group) {
      this.name = name;
      this.prereqs = prereqs;
      this.coreqs = coreqs;
      this.group = group
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
  getGroup(){
    return this.group;
  }
}
  
let list = document.getElementById("list");
document.getElementById("sendMessage").addEventListener("click", () => {
    window.postMessage("fetch");
    console.log("Msg sent");
})

function populateList(course, parentList){
  let item = document.createElement("li");
  if(course.getGroup()!=-1)
    item.innerHTML= course.getName() + "<sup>" +course.getGroup() + "</sup>";
  else
    item.innerText = course.getName();
  parentList.appendChild(item);

  if (course.getPrereqs().length!=0){
    let prereqs = course.getPrereqs(); 
    let subList = document.createElement("ul");
    parentList.appendChild(subList);

    prereqs.forEach((item)=>{
      if (item.getPrereqs().length!=0)
        populateList(item, subList)
      else
      {
        let subItem = document.createElement("li");
        if(item.getGroup()!=-1)
          subItem.innerHTML = item.getName() + "<sup>" + item.getGroup() + "</sup>";
        else
          subItem.innerText = item.getName();
        subList.appendChild(subItem);
      }
    })

    if (course.getCoreqs().length!=0){
      let prereqs = course.getCoreqs(); 
  
      prereqs.forEach((item)=>{
        if (item.getCoreqs().length!=0)
          populateList(item, subList)
        else
        {
          let parentItem = document.createElement("li");
          if(item.getGroup()!=-1)
            parentItem.innerHTML = item.getName() + " [Corequisite]<sup>" + item.getGroup() + "</sup>";
          else
            parentItem.innerText = item.getName() +" [Corequisite]";
          parentList.appendChild(parentItem);
        }
      })
    }
  }
}

var test = populateList(new Course("COMP 251", 
[new Course ("MATH 240", [new Course ("MATH 133", [],[], -1)],[], 2) , new Course ("MATH 235", [], [], 2)], 
[new Course("COMP 206", [], [], 1)], 1), document.getElementById("list"));
    console.log(event.data);
    //TODO: What to do when recieving the courses back
})
