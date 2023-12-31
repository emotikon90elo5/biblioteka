let closePopup = document.getElementById("closePopup");
let PopupCancel = document.getElementById("Cancel");
let PopupCommit = document.getElementById("Commit");
let popupText = document.getElementById("exampleModalLongTitleContent");
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
    td3.innerText = e.localid;
    tr.append(td3);

    let td4 = document.createElement("td");

    let button = document.createElement("a");

    button.onclick = () => {
      popupRemove();
    };
    function popupRemove() {
      popupText.innerHTML = `<b>${e.title}</b>`;
      popupText.setAttribute("value", e.id)
      $("#exampleModalCenter").modal("show");
    }
    let remove = document.createElement("i");
    remove.classList.add("ti");
    remove.classList.add("ti-trash");
    button.append(remove);
    td4.append(button);

    let updateHref = document.createElement("a");
    updateHref.href = `/admin/updatebook/${e.id}`;
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

closePopup.addEventListener("click", () => {
  $("#exampleModalCenter").modal("hide");
});
PopupCancel.addEventListener("click", () => {
  $("#exampleModalCenter").modal("hide");
});
PopupCommit.addEventListener("click", async () => {
  $("#exampleModalCenter").modal("hide");
  const response = await fetch(`/api/manage/delete/book`, {
    credentials: "include",
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: popupText.getAttribute("value")
    })
  });
  window.location.reload();
});
