async function update() {
    let table = document.getElementById("table");
    const response = await fetch(`http://http://localhost:4000/api/config/pupils`, {
      credentials: "include",
    });
    let jsona = await response.json();
    console.log(jsona);
    document.getElementById("firstName").value = jsona.data.firstName;
    document.getElementById("lastName").value=jsona.data.lastName
    document.getElementById("classID").value=jsona.data.classId
  }
  update();
  