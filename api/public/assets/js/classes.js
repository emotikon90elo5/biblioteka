
async function classes() {
  let clas = document.getElementById("class");
  const response = await fetch("http://localhost:4000/api/config/class", {
    credentials: "include"
  });
  let html = ""
  let jsona =  await response.json()
  console.log(jsona)
  await jsona.data.forEach(claa=>{
    html += `<option value="${claa.ID}">${claa.Name}</option>`
  })
  clas.innerHTML = html
  
}
classes()