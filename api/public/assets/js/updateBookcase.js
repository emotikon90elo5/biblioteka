async function update() {
    let table = document.getElementById("table");
    let popupText = document.getElementById("exampleModalLongTitleContent");
    const response = await fetch(`http://localhost:4000/api/books/shelf/${bookcaseId}`, {
      credentials: "include",
    });
    let jsona = await response.json();
    console.log(jsona);
    
    document.getElementById("headerName").innerText += ` ${jsona.data.name}`;
    
    document.getElementById("name").value=jsona.data.name
    document.getElementById("shelf").value=jsona.data.bookcasesId
  }
  update();
  async function classes() {
    let clas = document.getElementById("shelf");
    const response = await fetch("http://localhost:4000/api/config/shelf", {
      credentials: "include",
    });
    let jsona = await response.json();
    await jsona.data.forEach((e) => {
      let opt = document.createElement("option");
      if (typeof selected != undefined) {
        if (selected == e.id) {
          opt.selected = true
        }
      }
      opt.value = e.id;
      opt.innerText = e.name;
      clas.append(opt);
    });
  }
  classes();
  