$(document).ready(function() {
    // Get the modal
    var modal = document.getElementById("credits-modal");

    $(".card-credits").click((e) => {
        // $('#news-modal').css("transform","translate(0,0)");
        $("#credits-modal").show();
        $("#news-modal").hide();
        // $(".container").hide();
        // console.log("News click");
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
        // $('#news-modal').css("transform","translate(0,-100px)");
        // $("#news-modal").fadeOut(400);
        $("#credits-modal").hide();
        // $(".container").show();
    }
});