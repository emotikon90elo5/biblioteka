async function classes() {
    let clas = document.getElementById("class");
    const response = await fetch("http://localhost:4000/api/config/shelves", {
      credentials: "include",
    });
    let jsona = await response.json();
    await jsona.data.forEach((claa) => {
      let opt = document.createElement("option");
      opt.value = claa.ID;
      opt.innerText = claa.Name;
      clas.append(opt);
    });
  }
  classes();