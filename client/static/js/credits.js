$(document).ready(function() {
    var modal = document.getElementById("credits-modal");

    $(".card-credits").click((e) => {
        $("#credits-modal").show();
        $("#news-modal").hide();
    });

    $("#credits-modal-close").click((e) => {
        closeCreditsModal();
    });
    
    window.onclick = function(event) {
        if (event.target == modal) {
            closeCreditsModal();
        }
    }

    function closeCreditsModal() {
        $("#credits-modal").hide();
    }
});