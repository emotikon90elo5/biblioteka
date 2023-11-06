

async function shelf() {
  let table = document.getElementById("table");
  const response = await fetch(`/api/config/find/rentedbooks/${id}?${title?`title=${title}`:""}&${bookId?`bookId=${bookId}`:""}`, {
    credentials: "include",
  });
  let jsona = await response.json();
  document.getElementById("title").value = title?title:""
    document.getElementById("bookId").value = bookId?bookId:""
    
  await jsona.data.forEach((e) => {
    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    td1.innerText = e.title;
    tr.append(td1);
    let td3 = document.createElement("td");
    td3.innerText = e.localid;
    tr.append(td3);

    let td4 = document.createElement("td");
    let updateHref = document.createElement("a");
    updateHref.href = `/admin/returnBook/${e.id}`;
    let update = document.createElement("i");
    update.classList.add("ti");
    update.classList.add("ti-pencil");
    updateHref.append(update);
    td4.append(updateHref);

    tr.append(td4);

    table.append(tr);
  });
}
shelf();