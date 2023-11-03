async function type() {
  let type = document.getElementById("type");
  const response = await fetch("http://localhost:4000/api/config/types", {
    credentials: "include",
  });
  let jsona = await response.json();
  await jsona.data.forEach((claa) => {
    let opt = document.createElement("option");
    opt.value = claa.id;
    if (typeof selectedtype != undefined) {
      if (selectedtype == claa.id) {
        opt.selected = true;
      }
    }
    opt.innerText = claa.name;
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
    claa.shelves.forEach((e) => {
      let opt = document.createElement("option");
      if (typeof selectedshelf != undefined) {
        if (selectedshelf == e.id) {
          opt.selected = true;
        }
      }
      opt.value = e.id;
      opt.innerText ="Szafka:" + claa.name + "  Półka:" + e.name;
      shelf.append(opt);
    });
  });
}
shelf();
