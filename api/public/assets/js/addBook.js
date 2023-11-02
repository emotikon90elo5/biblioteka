async function type() {
  let type = document.getElementById("type");
  const response = await fetch("http://localhost:4000/api/config/types", {
    credentials: "include",
  });
  let jsona = await response.json();
  await jsona.data.forEach((claa) => {
    let opt = document.createElement("option");
    opt.value = claa.ID;
    if (typeof selectedtype != undefined) {
      if (selectedtype == claa.ID) {
        opt.selected = true
      }
    }
    opt.innerText = claa.Name;
    type.append(opt);
  });
}
type();
async function shelf() {
  let shelf = document.getElementById("shelf");
  const response = await fetch("http://localhost:4000/api/config/shelf", {
    credentials: "include",
  });
  let jsona = await response.json();
  await jsona.data.forEach((claa) => {
    let opt = document.createElement("option");
    if (typeof selectedshelf != undefined) {
      if (selectedshelf == claa.ID) {
        opt.selected = true
      }
    }
    opt.value = claa.ID;
    opt.innerText = "Szafka:" + claa.BookcaseName + "  Półka:" + claa.ShelfName;
    shelf.append(opt);
  });
}
shelf();