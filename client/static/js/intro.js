$(document).ready(function() {
    var x = Cookies.get();
    console.log(x)
    var modal = $("#intro-modal");
    if (Cookies.get('introModal') == undefined) {
        $(".modal").hide();
        modal.show();
        
        Cookies.set('introModal', 'true')
        $("#intro-modal-close").click((e) => {
            modal.hide();
        });
    }
});