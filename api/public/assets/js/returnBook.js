async function shelf() {
  
}
shelf();
let selectedshelf;
let selectedtype;
async function bookschelf() {
  let shelf = document.getElementById("bookcase");
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
  let table = document.getElementById("table");
  const response2 = await fetch(`/api/books/book/${id}`, {
    credentials: "include",
  });
  let jsona2 = await response2.json();
  document.getElementById("bookName").innerText += ` ${jsona2.data.title}`
  document.getElementById("bookcase").value = jsona2.data.shelvesId;
}
bookschelf();
