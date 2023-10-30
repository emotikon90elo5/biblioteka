async function shelf() {
    let shelf = document.getElementById("name");
    const response = await fetch("http://localhost:4000/api/config/books", {
      credentials: "include",
    });
    let jsona = await response.json();
    await jsona.data.forEach((e) => {
      let opt = document.createElement("option");
      opt.value = e.ID;
      opt.innerText = e.Title;
      shelf.append(opt);
    });
  }
  shelf();