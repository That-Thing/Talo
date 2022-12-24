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
            toastr.success("Database initialized");
            setTimeout(function () {
                window.location.href = "/setup/step/2";
            }, 2000);
        }).fail(function (data) {
            toastr.error(data.status + ": " + data.statusText);
        });
    });
    $("#register").click(function () {
        $.ajax({
            url: "/setup/step/2",
            type: "POST",
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
                password2: $("#password2").val()
            }
        }).done(function (data) {
            toastr.success("Account created");
            setTimeout(function () {
                window.location.href = "/setup/step/3";
            }, 2000);
        }).fail(function (data) {
            toastr.error(data.status + ": " + data.statusText);
        });
    });
});