class Course {
  constructor(name, prereqs, coreqs) {
      this.name = name;
      this.prereqs = prereqs;
      this.coreqs = coreqs;
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
}

let data = ['COMP251', 'MATH240'];
  
let list = document.getElementById("list");
  
// data.forEach((item)=>{
//   let li = document.createElement("li");
//   li.innerText = item;
//   list.appendChild(li);
// })

function populateList(course){
  let item = document.createElement("li");
  item.innerText = course.getName();
  list.appendChild(item);
  let prereqs = course.getPrereqs(); 
  let coreqs = course.getCoreqs();
}

var test = populateList(new Course("COMP251", ["MATH240", "MATH235"], ["COMP206"]));