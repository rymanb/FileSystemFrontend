const express = require('express');
const axios = require('axios');
const request = require('request');

const app = express();
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    // get user email from request stored in X-MS-CLIENT-PRINCIPAL-NAME header
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        // return all headers if user email is not found
        userEmail = 'boneyshark22@gmail.com';
        }
    var userid = userEmail.split('@')[0];

    var userJson = { id: userid, userid: userid, email: userEmail };

    var userDBInterfaceUrl = 'https://userdatabaseinterface.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/api/user';
    var userString = JSON.stringify(userJson);


        // send post request to user database interface to create user
        // will respont with 200 if it was successful
        fetch(userDBInterfaceUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: userString
            })
        .then(response => {
            if (response.status != 200) {
                throw new Error('User database interface returned status code ' + response.status);
                }
            }
            )
        .catch(error => {
            console.error('Error:', error);
            }
            );


    // send html, css, and js files
    res.sendFile(__dirname + '/index.html');
    });

app.get('/user', (req, res) => {
    // get user email from request stored in X-MS-CLIENT-PRINCIPAL-NAME header
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        userEmail = 'boneyshark22@gmail.com';
        }
    var userid = userEmail.split('@')[0];
    res.json({ email: userEmail, userid: userid });
    });

app.get('/files', (req, res) => {
    try
    {
        // send file list
        var userEmail = req.headers['x-ms-client-principal-name'];
        if (!userEmail) {
            // throw error if user email is not found
            throw new Error('User email not found');
            }
        var userid = userEmail.split('@')[0];

        var url = 'https://filesystemapp.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/listfiles?userid=' + userid;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            res.json(data);
            });
    }
    catch (error)
    {
        console.error('Error:', error);
        // return test set of files if error occurs
        var data = [
            { filename: 'file1.txt' },
            { filename: 'file2.txt' },
            { filename: 'file3.txt' }
            ];
        res.json(data);
    }

    });

app.get('/download', async (req, res) => {
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        userEmail = 'boneyshark22@gmail.com';
        }
    var userid = userEmail.split('@')[0];
    var filename = req.query.filename;
    var url = 'https://filesystemapp.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/download?userid=' + userid + '&filename=' + filename;
    // url will return file as attachment, return file as attachment to client
    // cant redirect to url because api is internal and not accessible from client
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
        });

        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('Content-Length', response.headers['content-length']);

    response.data.pipe(res);

    });


app.get('/delete', (req, res) => {
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        userEmail = 'boneyshark22@gmail.com';
        }
    var userid = userEmail.split('@')[0];
    var filename = req.query.filename;
    var url = 'https://filesystemapp.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/delete?userid=' + userid + '&filename=' + filename;
    fetch(url)
    .then(response => {
        if (response.status != 200) {
            throw new Error('delete returned status code ' + response.status);
            }

            res.json({ status: 'success' });
        }
        )
    .catch(error => {
        console.error('Error:', error);
        }
        );


    });

// upload file to server
app.post('/upload', async (req, res) => {
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        userEmail = 'boneyshark22@gmail.com';
        }
    var userid = userEmail.split('@')[0];
    var url = 'https://filesystemapp.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/uploadfile?userid=' + userid;


    req.pipe(request.post(url)).pipe(res);


    }
    );






app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    });

