$(function() {
    $("#logout").click(function() {
        $.ajax({
            url: "/auth/logout",
            type: "POST",
        }).done(function(data) {
            window.location.href = "/auth/login";
        }).fail(function(data) {
            toastr.error(data.responseJSON.status);
        });
    });
});