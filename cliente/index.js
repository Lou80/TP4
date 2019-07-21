const baseURL = 'http://localhost:3000';

fetch(`${baseURL}/api/users`)
    .then(function (res) {
        return res.json()
    })
    .then(function (users) {
        users.forEach(u => {
            const user = `
            <tr id=${u.id}>
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox5" name="options[]" value="1">
                    <label for="checkbox5"></label>
                </span>
            </td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.address}</td>
            <td>${u.phoneNumber}</td>
            <td>
                <a onclick="edit(1)" href="#editEmployeeModal" class="edit" data-toggle="modal"><i
                        class="material-icons" data-toggle="tooltip" title="Edit"
                        style="color: #ffc107"></i></a>
                <a onclick="remove(1)" href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i
                        class="material-icons" data-toggle="tooltip" title="Delete"
                        style="color: #f44336"></i></a>
            </td>
        </tr>`;
            const table = document.querySelector('.table-wrapper table');
            table.innerHTML += user;
        })
    })

document.querySelector('.modal-content form').onsubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const newEmployee = {
        name: name,
        email: email,
        address: address,
        phoneNumber: phone,
    }
    fetch(`${baseURL}/api/users`, {
        method: 'post',
        body: JSON.stringify(newEmployee),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(u => {
            const user = `
            <tr id=${u.id}>
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox5" name="options[]" value="1">
                    <label for="checkbox5"></label>
                </span>
            </td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.address}</td>
            <td>${u.phoneNumber}</td>
            <td>
                <a onclick="edit(1)" href="#editEmployeeModal" class="edit" data-toggle="modal"><i
                        class="material-icons" data-toggle="tooltip" title="Edit"
                        style="color: #ffc107"></i></a>
                <a onclick="remove(1)" href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i
                        class="material-icons" data-toggle="tooltip" title="Delete"
                        style="color: #f44336"></i></a>
            </td>
        </tr>`;
            const table = document.querySelector('.table-wrapper table');
            table.innerHTML += user;
        });
}