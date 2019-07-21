const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let userId = 1;

const users = [
    { id: 1, name: 'caca' }
];

app.get('/api/users', function (req, res) {
    res.json(users)
});

app.post('/api/users', function (req, res) {
    const newEmployee = req.body;
    /*if(newEmployee.name.length > 30 || !newEmployee.email.includes('@') || newEmployee.phoneNumber.typeOf !== 'number' ) {
         return res.status(400).send('error');
    }*/
    newEmployee.id = userId++;
    users.push(newEmployee);
    res.json(newEmployee);
});

app.listen(3000);