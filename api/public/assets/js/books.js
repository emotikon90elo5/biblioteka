async function shelf() {
    let table = document.getElementById("table");
    
    const response = await fetch("http://localhost:4000/api/config/books", {
      credentials: "include",
    });
    let jsona = await response.json();
    await jsona.data.forEach((e) => {
        let tr = document.createElement("tr")
          let td1 = document.createElement("td")
          td1.innerText = e.Title;
          tr.append(td1)
          let td2 = document.createElement("td")
          td2.innerText = e.Author;
          tr.append(td2)
          let td3 = document.createElement("td")
          td3.innerText = e.LocalID;
          tr.append(td3)
          let td4 = document.createElement("td")
          let remove = document.createElement("i")
          remove.classList.add("ti")
          remove.classList.add("ti-trash")
          td4.append(remove)
          let update = document.createElement("i")
          update.classList.add("ti")
          update.classList.add("ti-status-change")
          td4.append(update)
          tr.append(td4)
          table.append(tr)
      
    });
  }
  shelf();