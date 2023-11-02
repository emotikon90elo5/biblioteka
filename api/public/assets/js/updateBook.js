async function update() {
  let table = document.getElementById("table");
  let popupText = document.getElementById("exampleModalLongTitleContent");
  const response = await fetch(`http://localhost:4000/api/books/book/${id}`, {
    credentials: "include",
  });
  let jsona = await response.json();
  console.log(jsona);
  document.getElementById("title").value = jsona.data.Title;
  document.getElementById("author").value=jsona.data.Author
  document.getElementById("publishingHouse").value=jsona.data.PublishingHouse
  document.getElementById("ageCategory").value=jsona.data.AgeCategory
  document.getElementById("type").value=jsona.data.Type_ID
  document.getElementById("shelf").value=jsona.data.Shelves_ID
  document.getElementById("localID").value=jsona.data.LocalID
}
update();
