function initClock() {
    var today = new Date();
    today = new Date(today.getTime() + today.getTimezoneOffset() * 60000); // convert to UTC/GMT for server processing
    window.day = today;
}

// checks if the set date is current day
const isPresentDay = () => {
    var today = new Date();
    today = new Date(today.getTime() + today.getTimezoneOffset() * 60000);
    today = today.setHours(0,0,0,0); // remove time

    var setDate = window.day;
    setDate = setDate.setHours(0,0,0,0); // remove time
    return setDate == today;
}

const isAtStart = () => {
    var startDate = new Date(Date.UTC(2020, 0, 29, 23, 59, 59));
    startDate = new Date(startDate.getTime() + startDate.getTimezoneOffset() * 60000);
    startDate = startDate.setHours(0,0,0,0);

    var setDate = window.day;
    setDate = setDate.setHours(0,0,0,0); // remove time
    return setDate <= startDate;
}

const checkDisableNextDay = () => {
    if (isPresentDay()) {
        $("#next-day").addClass("disabled");
        $("#current-day").addClass("disabled");
    } else {
        $("#next-day").removeClass("disabled");
        $("#current-day").removeClass("disabled");
    }
}

// we don't have data for jan 29
const checkDisablePrevDay = () => {
    if (isAtStart()) {
        $("#prev-day").addClass("disabled");
        $("#first-day").addClass("disabled");
    } else {
        $("#prev-day").removeClass("disabled");
        $("#first-day").removeClass("disabled");
    }
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

    checkDisableNextDay();
    checkDisablePrevDay();
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

$("#first-day").click((e) => {
    const disabled = e.currentTarget.classList.contains("disabled");
    if (!disabled && window.day instanceof Date) {
        const first = new Date(Date.UTC(2020, 0, 29, 0, 0, 0));
        window.day = first;
        updateClock();
        update();
    }
});

$("#prev-day").click((e) => {
    const disabled = e.currentTarget.classList.contains("disabled");
    if (!disabled && window.day instanceof Date) {
        window.day.setDate(window.day.getDate() - 1);
        updateClock();
        update();
    }
});

$("#next-day").click((e) => {
    const disabled = e.currentTarget.classList.contains("disabled");
    if (!disabled && window.day instanceof Date) {
        window.day.setDate(window.day.getDate() + 1);
        updateClock();
        update();
    }
});

$("#current-day").click((e) => {
    const disabled = e.currentTarget.classList.contains("disabled");
    if (!disabled) {
        initClock();
        updateClock();
        update();
    }
});

// END