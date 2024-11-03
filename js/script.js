function updateFileList() {

    // fetch user and store in local storage
    fetch('/user')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('userid', data.userid);
        });
        
    // create url with userid
    var userid = localStorage.getItem('userid');
    var url = 'https://filesystemapp.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/listfiles?userid=' + userid
    
    // fetch file list from https://filesystemapp.internal.wonderfulsky-750ba161.westus2.azurecontainerapps.io/listfiles?userid=xxxx
    fetch(url)
    .then(response => response.json())
    .then(data => {
        // update file list
        var ul = document.getElementById('filelist');
        ul.innerHTML = '';
        data.forEach(file => {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(file));
            ul.appendChild(li);
            });
        });
}
