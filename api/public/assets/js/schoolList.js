async function shelf() {
  const response = await fetch(`/api/school`, {
    credentials: "include",
  });
  let jsona = await response.json();

  let table = document.getElementById("table");

  await jsona.data.forEach((e) => {
  
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerText = e.name;
    tr.append(td1);
    let td2 = document.createElement("td");
    td2.innerText = e.location;
    tr.append(td2);
    tr.onclick = ()=>{window.location=`/school/${e.id}`;}
    table.append(tr);
  });
}
shelf();

