
$(document).ready(() => {

    //set the path in the navbar
    let path = window.location.href;
    let arr = path.split('\/');
    let pathToShow = "";
    for (i = 3; i < arr.length; i++) {
        pathToShow += arr[i] + '->';
    }

    document.getElementById("path").innerHTML = pathToShow;
})

//onclick listener for each file
function goToFolder(elem) {

    window.location.href = window.location.href + '/' + elem.id

}