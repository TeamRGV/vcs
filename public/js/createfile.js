$(document).ready(() => {


})

function postNewFileReq() {
    let fileName = document.getElementById('fileName').value + '.txt';
    let fileData = document.getElementById('fileData').value;
    let data = {
        fileName,
        fileData,
        file: true
    }

    $.ajax({
        url: window.location.href,
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
            document.getElementById('fileName').value = "";
            document.getElementById('fileData').value = "";
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "File Created Successfully!";
            let url = window.location.href;
            let redirectPath = url.split('new/');
            location.href = redirectPath[0] + redirectPath[1];
        }
    });
}

function postNewFolderReq() {
    let fileName = document.getElementById('folderName').value;
    let data = {
        fileName,
        file: false
    }
    $.ajax({
        url: window.location.href,
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
            document.getElementById('folderName').value = "";
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "Folder Created Successfully!";
            let url = window.location.href;
            let redirectPath = url.split('new/');
            location.href = redirectPath[0] + redirectPath[1];

        }
    });
}