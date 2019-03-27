
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
            alert('file created');
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
            alert('folder created');
        }
    });
}
