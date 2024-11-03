

function updateFileList() {

    fetch("/files")
    .then(response => response.json())
    .then(data => {
        // update file list with names of files and download and delete buttons
        var ul = document.getElementById('filelist');
        ul.className = "file-list";
        data.forEach(file => {
            var li = document.createElement('li');
            li.className = "file-list";
            li.textContent = file.filename;
            ul.appendChild(li);
            var downloadButton = document.createElement('button');
            downloadButton.className = "file-list";
            downloadButton.textContent = 'Download';
            downloadButton.onclick = function() {
                downloadFile(file.filename);
                };
            li.appendChild(downloadButton);
            var deleteButton = document.createElement('button');
            deleteButton.className = "file-list";
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                deleteFile(file.filename);
                };
            li.appendChild(deleteButton);
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

function getUser() {
    fetch("/user")
    .then(response => response.json())
    .then(data => {
        var user = document.getElementById('user_profile');
        user.textContent = data.userid;
        });
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
    });