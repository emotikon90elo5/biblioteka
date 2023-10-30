async function shelf() {
    let shelf = document.getElementById("shelf");
    const response = await fetch("http://localhost:4000/api/config/bookcase", {
      credentials: "include",
    });
    let jsona = await response.json();
    await jsona.data.forEach((e) => {
      let opt = document.createElement("option");
      opt.value = e.ID;
      opt.innerText = e.Name;
      shelf.append(opt);
    });
  }
  shelf();