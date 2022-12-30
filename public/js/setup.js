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
            toastr.error(responseJSON.error);
        });
    });
    $("#config-submit").click(function () {
        $.ajax({
            url: "/setup/step/2",
            type: "POST",
            data: {
                email: $("#email").val(),
                salt: $("#salt").val(),
                minify: true ? $("#minify").is(":checked") : false,
                logo: $("#logo").val(),
                favicon: $("#favicon").val(),
                title: $("#title").val(),
                description: $("#description").val(),
                keywords: $("#keywords").val(),
                author: $("#author").val(),
                contactemail: $("#contact-email").val(),
                registration: true ? $("#registration").is(":checked") : false,
                emailVerfication: true ? $("#email-verification").is(":checked") : false,
                invites: true ? $("#invites").is(":checked") : false,
                minPasswordLength: $("#min-password-length").val(),
                motd: true ? $("#motd").is(":checked") : false,
                motdMessage: $("#motd-message").val()
            }
        }).done(function (data) {
            toastr.success("Configuration saved");
            setTimeout(function () {
                window.location.href = "/setup/step/3";
            }, 2000);
        }).fail(function (data) {
            toastr.error(data.responseJSON.error);
        });
    });
    $("#register").click(function () {
        $.ajax({
            url: "/setup/step/3",
            type: "POST",
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
                password2: $("#password2").val()
            }
        }).done(function (data) {
            toastr.success("Account created");
            setTimeout(function () {
                window.location.href = "/setup/step/4";
            }, 2000);
        }).fail(function (data) {
            console.log(data);
            toastr.error(data.responseJSON.error);
        });
    });
    $("#generate-salt").click(function () {
        var salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        $("#salt").val(salt);
    });
});