let closePopup = document.getElementById("closePopup");
let PopupCancel = document.getElementById("Cancel");
let PopupCommit = document.getElementById("Commit");
let popupText = document.getElementById("exampleModalLongTitleContent");
async function shelf() {
  let table = document.getElementById("table");
  const response = await fetch(`/api/config/classpupils/${id}`, {
    credentials: "include",
  });
  let jsona = await response.json();
  document.getElementById("name").value = jsona.data.name
  document.getElementById("headerName").innerText += ` ${jsona.data.name}`;
  await jsona.data.pupils.forEach((e) => {

    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    td1.innerText = e.firstName;
    tr.append(td1);

    let td2 = document.createElement("td");
    td2.innerText = e.lastName;
    tr.append(td2);

    let td4 = document.createElement("td");

    let button = document.createElement("a");

    button.onclick = () => {
      popupRemove();
    };
    function popupRemove() {
      popupText.innerHTML = `<b>${e.firstName} ${e.lastName}</b>`;
      popupText.setAttribute("value", e.id)

      $("#exampleModalCenter").modal("show");
    }
    let remove = document.createElement("i");
    remove.classList.add("ti");
    remove.classList.add("ti-trash");
    button.append(remove);
    td4.append(button);

    let updateHref = document.createElement("a");
    updateHref.href = `/admin/updatepupil/${e.id}`;
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
  const response = await fetch(`/api/manage/delete/pupil`, {
    credentials: "include",
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: popupText.getAttribute("value")
    }),
  });
  const json = await response.json()
  if (!json.succes) {
    window.location.href = `/admin/pupilList/${id}/?message=${json.message}&messagetype=err`
  } else {
    window.location.href = `/admin/pupilList/${id}`
  }
});
