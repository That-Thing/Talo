$(function () {
    $("#btnInit").click(function () {
        $.ajax({
            url: "/setup/step/1",
            type: "POST",
            data: {
                dbhost: $("#dbhost").val(),
                dbname: $("#dbname").val(),
                dbuser: $("#dbuser").val(),
                dbpassword: $("#dbpassword").val()
            }
        }).done(function (data) {
            toastr.success(data.status);
            //Wait 2 seconds before redirecting
            setTimeout(function () {
                window.location.href = "/setup/step/2";
            }, 2000);
        }).fail(function (data) {
            toastr.error(data.responseJSON.status);
        });
    });
});