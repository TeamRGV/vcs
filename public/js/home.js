$(document).ready(() => {

})

function checkout() {
    let branchName = document.getElementById('checkout_branchname').value;
    let localRepoPath = document.getElementById('checkout_path').value;
    let manifestFileName = document.getElementById('checkout_manifest').value;
    let data = {
        branchName,
        localRepoPath,
        manifestFileName
    }
    $.ajax({
        url: '/checkout',
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
            document.getElementById('checkout_branchname').value = "";
            document.getElementById('checkout_path').value = "";
            document.getElementById('checkout_manifest').value = "";
            $('#myModal2').modal('hide');
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "Check-out done successfully. Please check the local repo at " + localRepoPath;
        }
    });
}

function checkin() {
    let sourcePath = document.getElementById('checkin_sourcefolder').value;
    let data = {
        sourcePath
    }
    $.ajax({
        url: '/checkin',
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
            document.getElementById('checkin_sourcefolder').value = "";
            $('#myModal1').modal('hide');
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "Check-in done successfully.Please check the remote repo ";
        }
    });
}

function createlabel() {
    let manifestFileName = document.getElementById('label_manifest').value;
    let labelName = document.getElementById('label_label').value;
    let data = {
        manifestFileName,
        labelName
    }
    $.ajax({
        url: '/label',
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
            document.getElementById('label_manifest').value = "";
            document.getElementById('label_manifest').value = "";
            $('#myModal3').modal('hide');
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "Label created successfully. Please check " + manifestFileName + " for label";
        }
    });
}

