async function bookcase() {
    let bookcase = document.getElementById("bookcase");
    const response = await fetch("http://localhost:4000/api/config/bookcase", {
      credentials: "include",
    });
    let jsona = await response.json();
    await jsona.data.forEach((e) => {
      let opt = document.createElement("option");
      if (typeof selectedBookcase != undefined) {
        if (selectedBookcase == e.id) {
          opt.selected = true;
        }
      }
      opt.value = e.id;
      opt.innerText = e.name;
      bookcase.append(opt);
    });
  }
  bookcase();