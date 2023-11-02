async function classes() {
  let clas = document.getElementById("classID");
  const response = await fetch("http://localhost:4000/api/config/class", {
    credentials: "include",
  });
  let jsona = await response.json();
  await jsona.data.forEach((claa) => {
    let opt = document.createElement("option");
    if (typeof selected != undefined) {
      if (selected == claa.ID) {
        opt.selected = true
      }
    }
    opt.value = claa.ID;
    opt.innerText = claa.Name;
    clas.append(opt);
  });
}
classes();
