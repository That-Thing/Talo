$(function() {
    $('#register').click(function() {
        if(window.location.href.includes("/auth/register")) {
            var username = $('#username').val();
            var password = $('#password').val();
            var confirm = $('#confirm').val();
            var invite = $('#invite').val();
            $.post('/auth/register', {username: username, password: password, confirm: confirm, invite: invite}, function(data) {
            }).done(function(data) {
                if(data.status == true) {
                    window.location.href = "/auth/login";
                }
            }).fail(function(data) {
                if(Array.isArray(data.responseJSON.status)) {
                    data.responseJSON.status.forEach(element => {
                        toastr.error(`${element.param}: ${element.msg}`, "Error");
                    });
                } else {
                    toastr.error(data.responseJSON.status);
                }
            });

        }
    });
    $('#login').click(function() {
        if(window.location.href.includes("/auth/login")) {
            var username = $('#username').val();
            var password = $('#password').val();
            $.post('/auth/login', {username: username, password: password}, function(data) {
            }).done(function(data) {
                if(data.status == true) {
                    window.location.href = "/dashboard";
                }
            }).fail(function(data) {
                if(Array.isArray(data.responseJSON.status)) {
                    data.responseJSON.status.forEach(element => {
                        toastr.error(`${element.param}: ${element.msg}`, "Error");
                    });
                } else {
                    toastr.error(data.responseJSON.status);
                }
            });
        }
    });
});
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}