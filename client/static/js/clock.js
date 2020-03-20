function clock() {
    var today = new Date();
    today = new Date(today.getTime() + today.getTimezoneOffset() * 60000); // convert to UTC/GMT for server processing
    var year = today.getFullYear();
    var month = zeros(today.getMonth() + 1); // get month returns 0-11
    var date = zeros(today.getDate());
    var hour = zeros(twelveHour(today.getHours()));
    var minutes = zeros(today.getMinutes());
    var seconds = zeros(today.getSeconds());
    // console.log(today.toLocaleTimeString());

    document.getElementById('year').innerHTML = year;
    document.getElementById('month').innerHTML = month;
    document.getElementById('date').innerHTML = date;

    document.getElementById('hour').innerHTML = hour;
    document.getElementById('min').innerHTML = minutes;
    document.getElementById('sec').innerHTML = seconds;
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

function dateTime() {
    clock();
    setTimeout(dateTime, 500);
}

dateTime();
// END