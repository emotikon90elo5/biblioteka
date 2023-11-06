async function update() {
    let table = document.getElementById("table");
    let popupText = document.getElementById("exampleModalLongTitleContent");
    const response = await fetch(`/api/books/shelf/${shelfId}`, {
      credentials: "include",
    });
    let jsona = await response.json();

    
    document.getElementById("headerName").innerText += ` ${jsona.data.name}`;
    
    document.getElementById("name").value=jsona.data.name
    
  }
  update();
  