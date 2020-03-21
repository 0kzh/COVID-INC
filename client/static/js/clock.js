const formatDate = (date) => {
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

const getCurrentDate = () => {
    var today = new Date();
    today = new Date(today.getTime() + today.getTimezoneOffset() * 60000); // convert to UTC/GMT for server processing
    return today;
}

const initClock = () => {
    window.day = getCurrentDate();
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

const firstDay = () => {
    const disabled = $("#first-day").hasClass("disabled");
    if (!disabled && window.day instanceof Date) {
        const first = new Date(Date.UTC(2020, 0, 29, 0, 0, 0));
        window.day = first;
        updateClock();
        if (!window.keyPressed) {
            update();
        }
    }
    updateSlider();
}

const prevDay = () => {
    const disabled = $("#prev-day").hasClass("disabled");
    if (!disabled && window.day instanceof Date) {
        window.day.setDate(window.day.getDate() - 1);
        updateClock();
        if (!window.keyPressed) {
            update();
        }
    }
    updateSlider();
}

const nextDay = () => {
    const disabled = $("#next-day").hasClass("disabled");
    if (!disabled && window.day instanceof Date) {
        window.day.setDate(window.day.getDate() + 1);
        updateClock();
        if (!window.keyPressed) {
            update();
        }
    }
    updateSlider();
}

const currentDay = () => {
    const disabled = $("#next-day").hasClass("#current-day");
    if (!disabled) {
        initClock();
        updateClock();
        if (!window.keyPressed) {
            update();
        }
    }
    updateSlider();
}

const nDaysfromStart = (days) => {
    const offset = days*24*60*60*1000;

    const first = new Date(Date.UTC(2020, 0, 29, 0, 0, 0));
    const target = new Date(first.getTime() + offset);
    window.day = target;
    updateClock();
    if (!window.keyPressed) {
        update();
    }
    updateSlider();
}

const initSlider = () => {
    const data = window.data;
    const slider = $("#slider");
    if (data) {
      const numDays = Object.keys(data).length;
      slider.attr("max", numDays)
            .attr("value", numDays)
    }
}
  
const updateSlider = () => {
    const day = window.day;
    const first = new Date(Date.UTC(2020, 0, 29, 0, 0, 0));
    const one_day = 1000 * 60 * 60 * 24 
    const diff = Math.round(day.getTime() - first.getTime()) / one_day;
    console.log(diff);
    $("#slider").val(diff);
}

$("#first-day").click((e) => {
    firstDay();
});

$("#prev-day").click((e) => {
    prevDay();
});

$("#next-day").click((e) => {
    nextDay();
});

$("#current-day").click((e) => {
    currentDay();
});

$("#slider").change((e) => {
    const numDays = $("#slider").val();
    console.log(numDays);
    nDaysfromStart(numDays);
})

// END