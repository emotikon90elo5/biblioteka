async function update() {
    let table = document.getElementById("table");
    const response = await fetch(`http://localhost:4000/api/config/pupils/${pupilId}`, {
      credentials: "include",
    });
    let jsona = await response.json();
    document.getElementById("headerName").innerText += ` ${jsona.data.firstName} ${jsona.data.lastName}`;
      document.getElementById("firstName").value = jsona.data.firstName;
      document.getElementById("lastName").value=jsona.data.lastName
      document.getElementById("classID").value=jsona.data.classId
  }
  update();
  