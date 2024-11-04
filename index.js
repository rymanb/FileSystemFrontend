const express = require('express');
const axios = require('axios');
const request = require('request');

const app = express();
app.use(express.static(__dirname + '/public'));

// if runing locally to test, without internal api's
var local = true;


app.get('/', async (req, res) => {
    // get user email from request stored in X-MS-CLIENT-PRINCIPAL-NAME header
    // get /.auth/me and return it
    
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        // return all headers if user email is not found
        if (local) {
            userEmail = 'boneyshark22@gmail.com';
        }
        else {
            // return not authorized if user email is not found
            res.status(401).send('Not authorized');
        }
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

app.get('/user', async (req, res) => {
    // get user email from request stored in X-MS-CLIENT-PRINCIPAL-NAME header
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        // return all headers if user email is not found
        if (local) {
            userEmail = 'boneyshark22@gmail.com';
        }
        else {
            // return not authorized if user email is not found
            res.status(401).send('Not authorized');
        }
    }
    
    var userid = userEmail.split('@')[0];


    
    res.json({ email: userEmail, userid: userid});
    });

app.get('/files', async (req, res) => {
    try
    {
        // send file list
        var userEmail = req.headers['x-ms-client-principal-name'];
        if (!userEmail) {

            // return not authorized if user email is not found
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
        if (local)
        {
            // wait for 5 seconds before returning test set of files
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(1000);

            var data = [{"id":"boneyshark22-M345_Project#2 Rubric.docx","userid":"boneyshark22","filename":"M345_Project#2 Rubric.docx","contenttype":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","contentlength":24657},{"id":"boneyshark22-Upload1txt.txt","userid":"boneyshark22","filename":"Upload1txt.txt","contenttype":"text/plain","contentlength":7},{"id":"boneyshark22-paper.pdf","userid":"boneyshark22","filename":"paper.pdf","contenttype":"application/pdf","contentlength":1915388}];
            res.json(data);
        }
        else
        {
            res.status(500).send('Internal server error');
        }
    }

    });

app.get('/download', async (req, res) => {
    var userEmail = req.headers['x-ms-client-principal-name'];
    if (!userEmail) {
        // return all headers if user email is not found
        if (local) {
            userEmail = 'boneyshark22@gmail.com';
        }
        else {
            // return not authorized if user email is not found
            res.status(401).send('Not authorized');
        }
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
        // return all headers if user email is not found
        if (local) {
            userEmail = 'boneyshark22@gmail.com';
        }
        else {
            // return not authorized if user email is not found
            res.status(401).send('Not authorized');
        }
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
        // return all headers if user email is not found
        if (local) {
            userEmail = 'boneyshark22@gmail.com';
        }
        else {
            // return not authorized if user email is not found
            res.status(401).send('Not authorized');
        }
    }

    var userid = userEmail.split('@')[0];
    var url = 'https://filesystemapp.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/uploadfile?userid=' + userid;


    req.pipe(request.post(url)).pipe(res);


    }
    );






app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    });

