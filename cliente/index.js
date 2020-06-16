const baseURL = "http://localhost:3000";

fetch(`${baseURL}/api/users`)
  .then(function (res) {
    return res.json();
  })
  .then(function (users) {
    users.forEach((u) => {
      const user = `
      <tr id="row_${u.id}">
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.address}</td>
            <td>${u.phoneNumber}</td>
            <td>
                <a onclick="edit(1)"  class="edit" data-toggle="modal"><i
                        class="material-icons" data-toggle="tooltip" title="Edit"
                        style="color: #ffc107; cursor: pointer;"></i></a>
                <a onclick="remove()"  class="delete"  ><i id="${u.id}"
                        class="material-icons" data-toggle="tooltip" title="Delete"
                        style="color: #f44336; cursor: pointer;"></i></a>
            </td>
        </tr>`;
      const tableBody = document.querySelector("table tbody");
      tableBody.innerHTML += user;
    });
  });

document.querySelector(".modal-content form").onsubmit = function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const phoneNumber = parseInt(document.getElementById("phone").value);
  const phoneNumberOk = typeof phoneNumber;

  if (name.length <= 30 && email.includes("@") && phoneNumberOk === "number") {
    const newEmployee = {
      name: name,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
    };

    fetch(`${baseURL}/api/users`, {
      method: "post",
      body: JSON.stringify(newEmployee),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((u) => {
        const user = `
            <tr id="row_${u.id}">
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.address}</td>
            <td>${u.phoneNumber}</td>
            <td>
                <a onclick="edit(1)" class="edit" data-toggle="modal"><i
                        class="material-icons" data-toggle="tooltip" title="Edit"
                        style="color: #ffc107; cursor: pointer;"></i></a>
                <a onclick="remove()" class="delete"><i id="${u.id}"
                        class="material-icons" data-toggle="tooltip" title="Delete"
                        style="color: #f44336; cursor: pointer;"></i></a>
            </td>
        </tr>`;
        const tableBody = document.querySelector("table tbody");
        tableBody.innerHTML += user;
      });
  } else {
    console.log("hay algún error");
  }
};

const remove = () => {
  const employeeId = event.target.id;
  fetch(`${baseURL}/api/users/${employeeId}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      const targetRow = document.getElementById(`row_${employeeId}`);
      targetRow.parentNode.removeChild(targetRow);
    } else {
      console.log(res.statusText);
    }
  });
};
