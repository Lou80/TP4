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
      <tr id="row_${u._id}">
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.address ? u.address : ""}</td>
            <td>${u.phoneNumber}</td>
            <td>
                <a onclick="edit()"  class="edit" data-toggle="modal" data-toggle="modal"
                data-target="#exampleModal"><i id="${u._id}"
                        class="material-icons" data-toggle="tooltip" title="Edit"
                        style="color: #ffc107; cursor: pointer;"></i></a>
                <a onclick="remove()"  class="delete"  ><i id="${u._id}"
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
            <tr id="row_${u._id}">
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.address}</td>
            <td>${u.phoneNumber}</td>
            <td>
                <a onclick="edit()" class="edit" data-toggle="modal"
                data-target="#exampleModal"><i id="${u._id}"
                        class="material-icons" data-toggle="tooltip" title="Edit"
                        style="color: #ffc107; cursor: pointer;"></i></a>
                <a onclick="remove()" class="delete"><i id="${u._id}"
                        class="material-icons" data-toggle="tooltip" title="Delete"
                        style="color: #f44336; cursor: pointer;"></i></a>
            </td>
        </tr>`;
          const tableBody = document.querySelector("table tbody");
          tableBody.innerHTML += user;
        });
    } else {
      console.log(newEmployee);
      fetch(`${baseURL}/api/users/${employeeId}`, {
        method: "put",
        body: JSON.stringify(newEmployee),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((user) => {
          const { name, email, address, phoneNumber } = user;
          const targetRow = document.getElementById(`row_${employeeId}`);
          const { childNodes } = targetRow;
          const nameNode = childNodes[1];
          const newName = document.createTextNode(name);
          const emailNode = childNodes[3];
          const newEmail = document.createTextNode(email);
          const addressNode = childNodes[5];
          const newAddress = document.createTextNode(address);
          const phoneNode = childNodes[7];
          const newPhone = document.createTextNode(phoneNumber);
          nameNode.replaceChild(newName, nameNode.childNodes[0]);
          emailNode.replaceChild(newEmail, emailNode.childNodes[0]);
          addressNode.replaceChild(newAddress, addressNode.childNodes[0]);
          phoneNode.replaceChild(newPhone, phoneNode.childNodes[0]);
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
  setModalTexts("Add");
  setInputsText();
};

const edit = () => {
  setModalTexts("Edit");
  const selectedId = event.target.id;
  setFormId(selectedId);
  setInputsText(getEmployeeData(selectedId));
};

const setInputsText = (employeeDataArray) => {
  const formInputs = Array.from(
    document.getElementsByClassName("form-control")
  );
  let index = 0;
  formInputs.forEach((input) => {
    input.value = employeeDataArray ? employeeDataArray[index] : "";
    index++;
  });
};

const setModalTexts = (actionText) => {
  document.querySelector("h4.modal-title").innerText = `${actionText} Employee`;
  document
    .querySelector(".modal-footer input")
    .setAttribute("value", `${actionText}`);
};

const setFormId = (id) =>
  (document.querySelector(".modal-content form").id = id);

const getEmployeeData = (id) => {
  const targetRowData = Array.from(document.querySelectorAll(`#row_${id} td`));
  return targetRowData.map((tableData) => tableData.innerText);
};
