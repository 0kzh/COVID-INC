$(document).ready(function() {

    // Get the modal
    var modal = document.getElementById("news-modal");

    $(".news-button").click((e) => {
        // $('#news-modal').css("transform","translate(0,0)");
        $("#news-modal").show();
        $(".container").hide();
        console.log("News click");
    });

    $("#news-modal-close").click((e) => {
        closeModal();
    });
    
    window.onclick = function(event) {
        if (event.target == modal) {
        closeModal();
        }
    }

    function closeModal() {
        // $('#news-modal').css("transform","translate(0,-100px)");
        // $("#news-modal").fadeOut(400);
        $("#news-modal").hide();
        $(".container").show();
    }

    $("[id^='newshead']").click(function() {
        var key = $(this).attr('id');
        console.log(key);
        key = key.substring(9);
        console.log(key);
    
        $("[id='newsdesc-" + key + "']").toggle();
    });
});

var todayNews = [];
var currentIndex = 0;

function cycleNews() {
    $('#news-headline').text(todayNews[currentIndex]['headline']);
    currentIndex += 1;
    if (currentIndex >= todayNews.length) {
        currentIndex = 0;
    }
    setTimeout(function () {
        cycleNews();
    }, 15000);
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
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

    todayNews = window.newsData[formattedDate];
    console.log(todayNews);
    $('#news-headline').attr("class", "text");
    cycleNews();
}

function populateNews() {
    if (!window.newsData) {
        console.log("No news data found");
        return;
    }

    Object.keys(window.newsData).forEach((key) => {
        var dateTableHeader = "<tr><th>" + key + "</th></tr>";
        $("#news-headlines").append(dateTableHeader);

        var curr = 0;
        window.newsData[key].forEach((news_val) => {
            var newsTableHeadline = "<tr class='newshead' id='newshead-" + key + "-" + curr + "'><td>" + news_val["headline"] + "</td></tr>";
            var newsTableDescription = "<tr class='newsdesc' id='newsdesc-" + key + "-" + curr + "'><td>" + news_val["description"] + "</td></tr>";

            $("#news-headlines").append(newsTableHeadline, newsTableDescription);

            curr += 1;
        });
    });

    // Object.keys(window.data).forEach((key) => {
    //     generatePointInCountry(key, window.data[key]['total_cases'], window.data[key]['population'])
    //   });

    fillNewsBar(new Date());
}

window.newsData = {
    "2020-03-20": [
        {
            headline: "UK closes pubs, cafes and bars, and announces other measures",
            description: `<p>– In his daily briefing, the UK Prime Minister Boris Johnson announced that cafes, pubs, and bars to close, as well as shops, theatres and leisure centres, are to close to protect public health.</p>
            <p>– The government are deferring taxes to the end of the financial year, as well as waiving VAT for some businesses. It will also provide a job retention scheme to pay 80% of wages for those who cannot work due to the pandemic.</p>
            <p>&nbsp;</p>
            <p>Syria banned entry of visitors from multiple countries affected by the coronavirus pandemic. The government said that the cases in the nation remain zero.</p>`
        },
        {
            headline: "Germany cases jump to 13,957",
            description: `<p>– Germany’s Robert Koch Institute (RKI) reported that the number of cases surged by 2,958 to 13,957.</p>
            <p>– The number of deaths increased by 11 to 31.</p>`
        },
        {
            headline: "Spain’s deaths cross 1,000",
            description: `<p>– The death toll in Spain increased to 1,002 from 767, said the country’s health emergencies chief Fernando Simon .</p>
            <p>– The number of cases jumped to 19,980 from 17,147 on Thursday.<strong><br>
            </strong></p>`
        }
    ]
};

populateNews();
