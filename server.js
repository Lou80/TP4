const express = require('express');
const cors = require('cors');
const app = express();
app.use( cors() );
app.use( express.json() );

const users = [
    {id:1, name: 'caca'}
];

app.get('/api/users', function (req, res) {
    res.json(users)
});

app.post('/api/users', function (req, res) {

});

app.listen(3000);