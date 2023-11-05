async function update() {
  let table = document.getElementById("table");
  let popupText = document.getElementById("exampleModalLongTitleContent");
  const response = await fetch(`http://localhost:4000/api/books/book/${id}`, {
    credentials: "include",
  });
  let jsona = await response.json();
  console.log(jsona);
  
  document.getElementById("headerName").innerText += ` ${jsona.data.title}`;
  document.getElementById("title").value = jsona.data.title;
  document.getElementById("author").value=jsona.data.author
  document.getElementById("publishingHouse").value=jsona.data.publishingHouse
  document.getElementById("ageCategory").value=jsona.data.ageCategory
  document.getElementById("type").value=jsona.data.typeid
  document.getElementById("shelf").value=jsona.data.shelvesId
  document.getElementById("localID").value=jsona.data.localid
}
update();
