$(document).ready(function() {
    // Get the modal
    var modal = document.getElementById("news-modal");

    $(".news-button").click((e) => {
        // $('#news-modal').css("transform","translate(0,0)");
        $(".modal").hide();
        $("#news-modal").show();
        // $(".container").hide();
        // console.log("News click");
    });

    $("#news-modal-close").click((e) => {
        closeNewsModal();
    });
    
    window.onclick = function(event) {
        if (event.target == modal) {
        closeNewsModal();
        }
    }

    function closeNewsModal() {
        // $('#news-modal').css("transform","translate(0,-100px)");
        // $("#news-modal").fadeOut(400);
        $("#news-modal").hide();
        // $(".container").show();
    }
});

var todayNews = [];
var currentIndex = 0;
var newsExists = false;

var newsLoaded = false;

function cycleNews() {
    if (newsExists) {
        $('#news-headline').text(todayNews[currentIndex]['headline']);
    }
    currentIndex += 1;
    if (currentIndex >= todayNews.length) {
        currentIndex = 0;
    }
}

const resetNews = () => {
    console.log("Resetting news scroll...");
    $('#news-headline').text("");
    $('#news-headline').removeClass("text");
    setTimeout(() => {  
        $('#news-headline').addClass("text"); 
        cycleNews();
        clearInterval(window.newsTimer);
        window.newsTimer = setInterval(() => {
            cycleNews();
        }, 10000);
    }, 10);
}

function isValidDate(date) {
    return date && date instanceof Date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

// window.newsData is json with key: id, data: date, headline, link
// in: date is a formatted date (call formatDate()) or a Date() object
function fillNewsBar(date) {
    if (!window.newsData) {
        console.log("No news data found");
        return;
    }
    if (isValidDate(date)) formattedDate = formatDate(date);
    else formattedDate = date;

    if (!window.newsData[formattedDate]) {
        $('#news-headline').text("No news today");
        newsExists = false;
        console.log("No news today");
        return;
    }

    newsExists = true;
    todayNews = window.newsData[formattedDate];
    currentIndex = 0;
    resetNews();

    console.log("News headlines found:");
    console.log(todayNews);
}

function populateNews() {
    if (newsLoaded) return;

    if (!window.newsData) {
        console.log("No news data found");
        return;
    }

    console.log("Populating news...")

    Object.keys(window.newsData).sort().reverse().forEach((key) => {
        var dateTableHeader = "<tr id='newsdate-" + key + "'><th>" + key + "</th></tr>";
        $("#news-headlines").append(dateTableHeader);

        var curr = 0;
        window.newsData[key].forEach((news_val) => {
            var newsTableHeadline = "<tr class='newshead' id='newshead-" + key + "-" + curr + "'><td>" + news_val["headline"] + "</td></tr>";
            var newsTableDescription = "<tr class='newsdesc' id='newsdesc-" + key + "-" + curr + "'><td>" + news_val["text"] + "</td></tr>";

            $("#news-headlines").append(newsTableHeadline, newsTableDescription);

            curr += 1;
        });
    });

    $("[id^='newshead']").click(function() {
        var key = $(this).attr('id');
        key = key.substring(9);
    
        $("[id='newsdesc-" + key + "']").toggle();
    });

    newsLoaded = true;

    console.log("News populated.");
}

function datediff(d1, d2) {
    return Math.floor((d2 - d1) / 86400000); 
}

function setNewsToCurrDate() {

    var diff = datediff(window.day, getCurrentDate());
    // console.log(diff);

    var hide_date = new Date(window.day);

    $("[id^='newsdate']").show();
    $("[id^='newshead']").show();
    // $("[id^='newsdesc']").show();

    for (var i = 0; i < diff; i += 1) {
        hide_date.setDate(hide_date.getDate() + 1);
        var hide_date_formatted = formatDate(hide_date);
        $(`[id*='${hide_date_formatted}']`).hide();
    }

}
