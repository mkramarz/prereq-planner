let data = ['COMP251', 'MATH240'];
  
let list = document.getElementById("list");
  
data.forEach((item)=>{
  let li = document.createElement("li");
  li.innerText = item;
  list.appendChild(li);
})