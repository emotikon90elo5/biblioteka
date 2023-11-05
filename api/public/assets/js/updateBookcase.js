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
    
  }
  update();
  