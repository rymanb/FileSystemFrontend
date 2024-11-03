const express = require('express');

const app = express();
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    // get user email from request stored in X-MS-CLIENT-PRINCIPAL-NAME header
    var userEmail = req.headers['X-MS-CLIENT-PRINCIPAL-NAME'];


    // send index.html file
    res.sendFile(__dirname + '/index.html');
    });

app.get('/user', (req, res) => {
    // get user email from request stored in X-MS-CLIENT-PRINCIPAL-NAME header
    var userEmail = req.headers['X-MS-CLIENT-PRINCIPAL-NAME'];
    var userid = userEmail.split('@')[0];
    res.json({ email: userEmail, userid: userid });
    });

app.get('/files', (req, res) => {
    // send file list
    var files = ['file1.txt', 'file2.txt', 'file3.txt'];
    res.json(files);
    });

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    });

