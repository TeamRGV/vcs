
$(document).ready(() => {

    //set the path in the navbar
    let path = window.location.href;
    if (path == 'http://localhost:8080/repos' || path == 'http://localhost:8080/manifests') {
        document.getElementById('createfile').style.display = 'none';
        if (path == 'http://localhost:8080/manifests') {
            document.getElementById('createrepo').style.display = 'none';
        }
    } else {
        document.getElementById('createrepo').style.display = 'none';
    }
    let arr = path.split('\/');
    let pathToShow = "";
    for (i = 3; i < arr.length; i++) {
        pathToShow += arr[i] + '->';
    }

    document.getElementById("path").innerHTML = pathToShow;
})

function createNewFile() {
    let url = window.location.href.split('/');
    let newUrl = url[0] + '//' + url[2] + '/new'
    for (let i = 3; i < url.length; i++) {
        newUrl = newUrl + '/' + url[i];
    }

    window.location.href = newUrl;
}

function showInput() {
    document.getElementById('repoName').style.display = 'block';
    document.getElementById('createrepo').style.display = 'none';
    document.getElementById('submitRepoName').style.display = 'block';
}

function createRepo() {
    let fileName = document.getElementById('repoName').value
    let data = {
        fileName
    }
    if (fileName == '' || fileName.length == 0) {
        document.getElementById('repoName').style.display = 'none';
        document.getElementById('submitRepoName').style.display = 'none';
        document.getElementById('createrepo').style.display = 'block';
    } else {
        $.ajax({
            url: '/createrepo',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data) {
                location.reload()
            }
        });
    }


}

//onclick listener for each file
function goToFolder(elem) {
    let urlArray = window.location.href.split('/');
    if (urlArray[3] == 'manifests') {
        window.location.href = urlArray[0] + '//' + urlArray[2] + '/repos/' + elem.id

    } else {
        window.location.href = window.location.href + '/' + elem.id
    }


}