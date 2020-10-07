const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getUTCMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getUTCFullYear();
  
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
    var startDate = new Date(Date.UTC(2020, 1, 3, 23, 59, 59));
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

console.log("Initializing clock...");
initClock();
updateClock();

const firstDay = () => {
    const disabled = $("#first-day").hasClass("disabled");
    if (!disabled && window.day instanceof Date) {
        const first = new Date(Date.UTC(2020, 1, 3, 23, 59, 59));
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
            try {
                update(); // update may fail if data isn't present
            } catch (err) {
                return false;
            }
        }
    }
    updateSlider();
    return true;
}

const nextDay = () => {
    const disabled = $("#next-day").hasClass("disabled");
    const start = window.day.getDate();
    var succeeded = true;
    if (!disabled && window.day instanceof Date) {
        window.day.setDate(window.day.getDate() + 7);
        updateClock();
        if (!window.keyPressed) {
            try {
                if (!window.data[formatDate(window.day)]) {
                    succeeded = false;
                }
                update();
            } catch (err) {
                return false;
            }
        }
    }
    updateSlider();
    // console.log("start: " + start);
    // console.log("end: " + window.day.getDate())

    return succeeded;
}

const currentDay = () => {
    const disabled = $("#next-day").hasClass("#current-day");
    if (!disabled) {
        initClock();
        updateClock();
        if (!window.keyPressed) {
            try {
                update();
            } catch (err) {
                return false;
            }
        }
    }
    updateSlider();
    return true;
}

const nDaysfromStart = (days) => {
    const offset = days*7*24*60*60*1000;

    const first = new Date(Date.UTC(2020, 1, 3, 23, 59, 59));
    const target = new Date(first.getTime() + offset);
    window.day = target;
    updateClock();
    if (!window.keyPressed) {
        try {
            update();
        } catch (err) {
            return false;
        }
    }
    updateSlider();
    return true;
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
    const first = new Date(Date.UTC(2020, 1, 3, 0, 0, 0));
    const one_week = 1000 * 60 * 60 * 24 * 7
    const diff = Math.round(day.getTime() - first.getTime()) / one_week;
    $("#slider").val(diff);
}

const toggleControls = () => {
    $(".nav-container").animate({height: "toggle", width: "toggle"}, 500);
    $("#expand-icon").toggleClass("flipped");
}

const reset = () => {
    clearInterval(window.timer);
    window.timer = null;
    fillNewsBar(window.day);
    $("#play-button").addClass("fa-play");
    $("#play-button").removeClass("fa-pause");
}

const playPause = () => {
    if (!window.timer) {
        $("#play-button").removeClass("fa-play");
        $("#play-button").addClass("fa-pause");
        window.timer = setInterval(() => {
            if (!isPresentDay()) {
                const success = nextDay();
                if (!success) {
                    reset();
                }
            } else {
                reset();
            }
        }, 800);
    } else {
        reset();
    }    
}

$("#first-day").click((e) => {
    firstDay();
});

$("#prev-day").click((e) => {
    prevDay();
});

$("#play").click((e) => {
    playPause();
});

$("#next-day").click((e) => {
    nextDay();
});

$("#current-day").click((e) => {
    currentDay();
});

$("#slider").change((e) => {
    const numDays = $("#slider").val();
    nDaysfromStart(numDays);
})

$(".card-accordion").click((e) => {
    toggleControls();
})

// END