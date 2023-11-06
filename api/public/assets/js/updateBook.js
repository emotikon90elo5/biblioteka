let selectedshelf
let selectedtype;
async function update() {
  let table = document.getElementById("table");
  let popupText = document.getElementById("exampleModalLongTitleContent");
  const response = await fetch(`/api/books/book/${id}`, {
    credentials: "include",
  });
  let jsona = await response.json();
  
  document.getElementById("headerName").innerText += ` ${jsona.data.title}`;
  document.getElementById("title").value = jsona.data.title;
  document.getElementById("author").value = jsona.data.author
  document.getElementById("publishingHouse").value = jsona.data.publishingHouse
  document.getElementById("ageCategory").value = jsona.data.ageCategory
  selectedtype = jsona.data.typeid
  selectedshelf = jsona.data.shelvesId
  document.getElementById("localID").value = jsona.data.localid
}
async function type() {
  let type = document.getElementById("type");
  const response = await fetch("/api/config/types", {
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


async function shelf() {
  let shelf = document.getElementById("shelf");
  const response = await fetch("/api/config/shelf", {
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
      opt.innerText = "Szafka:" + claa.name + "  Półka:" + e.name;
      shelf.append(opt);
    });
  });
}
async function run() {
  await update()
  type();
  shelf();
}
run();
