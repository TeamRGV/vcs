$(document).ready(() => {

    $.ajax({
        url: '/manifestnames',
        type: 'get',
        success: function (data) {
            if (data.length > 0) {
                let mergeoutManifestsSource = document.getElementById('mergeout_manifests_source')
                data.forEach(elem => {
                    mergeoutManifestsSource.options[mergeoutManifestsSource.options.length] = new Option(elem, elem);
                })
                let mergeoutManifestsTarget = document.getElementById('mergeout_manifests_target')
                data.forEach(elem => {
                    mergeoutManifestsTarget.options[mergeoutManifestsTarget.options.length] = new Option(elem, elem);
                })
                let checkoutManifests = document.getElementById('checkout_manifests')
                data.forEach(elem => {
                    checkoutManifests.options[checkoutManifests.options.length] = new Option(elem, elem);
                })
                let labelManifests = document.getElementById('label_manifests')
                data.forEach(elem => {
                    labelManifests.options[labelManifests.options.length] = new Option(elem, elem);
                })

            }


        }
    });

})

function checkout() {
    let branchName = document.getElementById('checkout_branchname').value;
    let localRepoPath = document.getElementById('checkout_path').value;
    let checkoutElem = document.getElementById('checkout_manifests')
    let manifestFileName = checkoutElem.options[checkoutElem.selectedIndex].value;
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
            $('#myModal2').modal('hide');
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "Check-out done successfully. Please check the local repo at " + localRepoPath;
        }
    });
}


function mergeout() {
    let sourceManifestElem = document.getElementById('mergeout_manifests_source');
    let targetManifestElem = document.getElementById('mergeout_manifests_target');
    let sourceRepo = sourceManifestElem.options[sourceManifestElem.selectedIndex].value;
    let targetRepo = targetManifestElem.options[targetManifestElem.selectedIndex].value;
    let data = {
        sourceRepo,
        targetRepo
    }
    $.ajax({
        url: '/merge/mergeout',
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {

            $('#merge_out_modal').modal('hide');
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "Merged the two branches with manifests " + sourceManifestElem + " & " + targetManifestElem;
        }
    });
}

function mergein() {
    let sourcePath = document.getElementById('mergein_sourcefolder').value
    let data = {
        sourcePath
    }
    $.ajax({
        url: '/merge/mergein',
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
            document.getElementById('mergein_sourcefolder').value = "";
            $('#merge_in_modal').modal('hide');
            document.getElementById('alert').style.display = "block";
            let sourceArr = sourcePath.split('/');
            document.getElementById('alertmessage').innerHTML = "Merged in the remote repository for repo named " + sourceArr[sourceArr.length - 1];
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
    let labelElem = document.getElementById('label_manifests')
    let manifestFileName = labelElem.options[labelElem.selectedIndex].value;
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

            $('#myModal3').modal('hide');
            document.getElementById('alert').style.display = "block";
            document.getElementById('alertmessage').innerHTML = "Label created successfully. Please check " + manifestFileName + " for label";
        }
    });
}