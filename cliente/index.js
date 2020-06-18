const baseURL = "http://localhost:3000";

fetch(`${baseURL}/api/users`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    } else {
      console.log(res);
    }
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
                <a onclick="edit()"  class="edit" data-toggle="modal" data-toggle="modal"
                data-target="#exampleModal"><i id="${u.id}"
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
  const employeeId = e.target.id;
  const submitType = document.querySelector("h4.modal-title").innerText;
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
    if (submitType === "Add Employee") {
      fetch(`${baseURL}/api/users`, {
        method: "post",
        body: JSON.stringify(newEmployee),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => (res.ok ? res.json() : console.log(res)))
        .then((u) => {
          const user = `
            <tr id="row_${u.id}">
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.address}</td>
            <td>${u.phoneNumber}</td>
            <td>
                <a onclick="edit()" class="edit" data-toggle="modal"
                data-target="#exampleModal"><i id="${u.id}"
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
      fetch(`${baseURL}/api/users/${employeeId}`, {
        method: "put",
        body: JSON.stringify(newEmployee),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((user) => {
          const targetRow = document.getElementById(`row_${employeeId}`);
          const name = targetRow.childNodes[1];
          const newName = document.createTextNode(user.name);
          const email = targetRow.childNodes[3];
          const newEmail = document.createTextNode(user.email);
          const address = targetRow.childNodes[5];
          const newAdress = document.createTextNode(user.address);
          const phone = targetRow.childNodes[7];
          const newPhone = document.createTextNode(user.phoneNumber);
          name.replaceChild(newName, name.childNodes[0]);
          email.replaceChild(newEmail, email.childNodes[0]);
          address.replaceChild(newAdress, address.childNodes[0]);
          phone.replaceChild(newPhone, phone.childNodes[0]);
        });
    }
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

const addEmployeeModal = () => {
  document.querySelector("h4.modal-title").innerText = "Add Employee";
  document.querySelector(".modal-footer input").setAttribute("value", "Add");
};

const edit = () => {
  document.querySelector("h4.modal-title").innerText = "Edit Employee";
  document.querySelector(".modal-content form").id = event.target.id;
  document.querySelector(".modal-footer input").setAttribute("value", "Edit");
};
