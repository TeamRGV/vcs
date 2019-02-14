

$(document).ready(() => {
    $.ajax({
        url: "/repos",
        method: 'get',
        success: function (result) {
            console.log(result)
        }
    })
})