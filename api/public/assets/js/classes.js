async function classes() {
  let clas = document.getElementById("classID");
  const response = await fetch("http://localhost:4000/api/config/class", {
    credentials: "include",
  });
  let jsona = await response.json();
  await jsona.data.forEach((claa) => {
    let opt = document.createElement("option");
    if (typeof selected != undefined) {
      if (selected == claa.id) {
        opt.selected = true
      }
    }
    opt.value = claa.id;
    opt.innerText = claa.name;
    clas.append(opt);
  });
}
classes();
