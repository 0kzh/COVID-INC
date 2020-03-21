function initClock() {
    var today = new Date();
    today = new Date(today.getTime() + today.getTimezoneOffset() * 60000); // convert to UTC/GMT for server processing
    window.day = today;
}

function updateClock() {
    const day = window.day;
    
    if (day instanceof Date) {
        const year = day.getFullYear();
        const month = zeros(day.getMonth() + 1); // get month returns 0-11
        const date = zeros(day.getDate());
        const hour = zeros(twelveHour(day.getHours()));
        const minutes = zeros(day.getMinutes());
        const seconds = zeros(day.getSeconds());
        // console.log(today.toLocaleTimeString());

        document.getElementById('year').innerHTML = year;
        document.getElementById('month').innerHTML = month;
        document.getElementById('date').innerHTML = date;
    }
}

function twelveHour(hour) {
    if (hour > 12) {
        return hour -= 12
    } else if (hour === 0) {
        return hour = 12;
    } else {
        return hour
    }
}
// adds zero infront of single digit number
function zeros(num) {
    if (num < 10) {
        num = '0' + num
    };
    return num;
}

initClock();
updateClock();

$("#last-day").click(() => {
    if (window.day instanceof Date) {
        window.day.setDate(window.day.getDate() - 1);
        updateClock();
    }
});

$("#today").click(() => {
    initClock();
    updateClock();
});

$("#next-day").click(() => {
    if (window.day instanceof Date) {
        window.day.setDate(window.day.getDate() + 1);
        updateClock();
    }
});

// END