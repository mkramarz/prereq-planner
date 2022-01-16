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
          subItem.innerHTML= item.getName() + "<sup>" + item.getGroup() + "</sup>";
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
          parentItem.innerText = item.getName()+" [Corequisite]";
          parentList.appendChild(parentItem);
        }
      })
    }
  }
  //let coreqs = course.getCoreqs();
}

// function subList(course, parentList){
//   let subItem = document.createElement("li");
//   subItem.innerText = course.getName();
//   parentList.appendChild(subItem);
// }

var test = populateList(new Course("COMP 251", 
[new Course ("MATH 240", [new Course ("MATH 133", [],[], -1)],[], 1) , new Course ("MATH 235", [], [], 1)], 
[new Course("COMP 206", [], [], -1)], -1), document.getElementById("list"));
