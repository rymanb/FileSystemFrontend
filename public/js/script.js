

function updateFileList() {

    fetch("/files")
    .then(response => response.json())
    .then(data => {

        // disable loading spinner
        var spinner = document.getElementById('FileListSpinner');
        spinner.style.display = 'none';

        // update file list with names of files and download and delete buttons
        var ul = document.getElementById('filelist');
        ul.className = "file-list";
        data.forEach(file => {
            var li = document.createElement('li');
            // use tailwind css classes to style the list should be virtically centered
            //li.textContent = file.filename;
            var div = document.createElement('div');
            div.className = "list_name";
            var text = document.createElement('span');
            text.textContent = file.filename;
            div.appendChild(text);
            li.appendChild(div);
            ul.appendChild(li);

            div = document.createElement('div');
            div.className = "file-size-div";
            
            // size of file
            var size = document.createElement('span');
            //size.className = "px-6 text-3xl font-bold text-black-500 mt-4";
            var bytes = file.contentlength;
            var kb = bytes / 1024;
            var mb = kb / 1024;
            var gb = mb / 1024;

            if (gb >= 1) {
                size.textContent = gb.toFixed(2) + ' GB';
            }
            else if (mb >= 1) {
                size.textContent = mb.toFixed(2) + ' MB';
            }
            else if (kb >= 1) {
                size.textContent = kb.toFixed(2) + ' KB';
            }
            else {
                size.textContent = bytes + ' bytes';
            }
            div.appendChild(size);
            li.appendChild(div);

            div = document.createElement('div');
            div.className = "button-div";



            // download and delete buttons
            var deleteButton = document.createElement('button');
            deleteButton.className = "file-list";
            deleteButton.onclick = function() {
                deleteFile(file.filename);
                };
            var icon = document.createElement('i');
            icon.className = "fa fa-trash";
            deleteButton.appendChild(icon);
            div.appendChild(deleteButton);

            var downloadButton = document.createElement('button');
            downloadButton.className = "file-list";
            downloadButton.onclick = function() {
                downloadFile(file.filename);
                };
            var icon = document.createElement('i');
            icon.className = "fa fa-download";
            downloadButton.appendChild(icon);
            div.appendChild(downloadButton);

            li.appendChild(div);


            });
        });
}

function downloadFile(filename) {
    fetch('/download?filename=' + filename)
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        });
}

function deleteFile(filename) {
    fetch('/delete?filename=' + filename)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // update file list after deleting file
        var ul = document.getElementById('filelist');
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
            }
        updateFileList();
        });
}

async function getUser() {
    fetch("/user")
    .then(response => response.json())
    .then(data => {
        var user = document.getElementById('user_profile');
        user.textContent = data.userid;
        });

        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        };
    
    
            const requestOptions = {
                method: 'GET',
                headers: headers,
                'credentials': 'same-origin'  //credentials go here!!!
            };
    
            const response = await fetch('/.auth/me', requestOptions);
            const payload = await response.json();
            token = payload[0].access_token;

            url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token;//req.headers['x-ms-client-principal'];
            var data = await fetch(url);
            data = await data.json();

            var fl = document.getElementById('filelist');

            var img = document.createElement('img');
            img.src = data.picture;
    
            fl.appendChild(img);
            
}

document.addEventListener('DOMContentLoaded', function() {
    updateFileList();
    getUser();

    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-menu');

    menu.addEventListener('click', () => {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });


    // Event listener for file input
    const fileInput = document.getElementById('file-input');
    const fileSelect = document.getElementById('file-select');
    const dropZone = document.getElementById('drop-zone');
    const uploadBtn = document.getElementById('upload-btn');

    // Open file dialog on click
    fileSelect.addEventListener('click', () => fileInput.click());

    // Handle file selection
    fileInput.addEventListener('change', handleFiles);

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-blue-600');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-blue-600'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-600');
        fileInput.files = e.dataTransfer.files;
        handleFiles();
    });

    // Upload files on button click
    uploadBtn.addEventListener('click', uploadFiles);

});

function handleFiles() {
    // Files selected by the user
    const files = document.getElementById('file-input').files;
    const fileNames = document.getElementById('file-names');
    // You can display selected files or proceed to upload

    if (files.length === 0) {
        fileNames.textContent = 'No files selected for upload';
    } else {
        fileNames.textContent = 'Selected files: ' + Array.from(files).map(file => file.name).join(', ');
    }
}


function uploadFiles() {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Please select at least one file to upload.');
        return;
    }

    const formData = new FormData();
    for (let file of files) {
        formData.append('files', file);
    }

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    // then refresh file list
    .then(response => {
        if (response.status != 200) {
            throw new Error('File upload returned status code ' + response.status);
            }
        }
        )
    .then(() => {
        var ul = document.getElementById('filelist');
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
            }
        updateFileList();
        }
        )
    .catch(error => {
        console.error('Error:', error);
        }
        );



}
