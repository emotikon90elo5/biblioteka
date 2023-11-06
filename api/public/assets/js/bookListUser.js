
async function shelf() {
    let table = document.getElementById("table");
    
    const response = await fetch(`/api/books/find/School/${id}?${title?`title=${title}`:""}&${author?`author=${author}`:""}&${publishinghouse?`publishinghouse=${publishinghouse}`:""}&${name?`name=${name}`:""}`, {
      credentials: "include",
    });
    let jsona = await response.json();
    document.getElementById("author").value = author?author:""
    document.getElementById("title").value = title?title:""
    document.getElementById("publishinghouse").value = publishinghouse?publishinghouse:""
    document.getElementById("type").value = name?name:""
    await jsona.data.forEach((e) => {
    
      let tr = document.createElement("tr");
  
      let td1 = document.createElement("td");
      td1.innerText = e.title;
      tr.append(td1);
  
      let td2 = document.createElement("td");
      td2.innerText = e.author;
      tr.append(td2);

      let td3 = document.createElement("td");
      td3.innerText = e.publishingHouse;
      tr.append(td3);

      let td4 = document.createElement("td");
      td4.innerText = e.type.name;
      tr.append(td4);
      let td5 = document.createElement("td");
      td5.innerText = e.shelf.name;
      tr.append(td5);
      let td6 = document.createElement("td");
      td6.innerText = e.shelf.bookcase.name;
      tr.append(td6);

      table.append(tr);
    });
  }
shelf()
  
  