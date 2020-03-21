function fill(flag, name, infected, dead, total) {

    countDead = document.getElementById('dead-count');
    if (dead === 'No data') {
        countDead.innerHTML = 'No data';
        dead = 0;
    }
    else {
        countDead.innerHTML = dead.toLocaleString();
    }
    
    countInfected = document.getElementById('infected-count');
    if (infected === 'No data') {
        countInfected.innerHTML = 'No data';
        infected = 0;
    }
    else {
        countInfected.innerHTML = infected.toLocaleString();
    }

    healthy = total - dead - infected;

    console.log(total + " " + dead + " " + infected + " " + healthy);

    // totalNonHealthy = infected + dead;

    // logNonHealthy = Math.log(totalNonHealthy);
    // logTotal = Math.log(total);

    // percentDead = (dead/totalNonHealthy)*(logNonHealthy/logTotal)*100;
    // percentInfected = (infected/totalNonHealthy)*(logNonHealthy/logTotal)*100;
    // percentHealthy = 100 - percentDead - percentInfected;

    $(".card-info .thumbnail").css("background-image", `url(${flag})`);
    $("#country-name").text(name);

    percentDead = 0; 
    if (total > 0) {
        if (dead > 0) {
            percentDead = Math.max(2, 100*dead/total);
        }
    }
    
    percentInfected = 0;
    if (total > 0) {
        if (infected > 0) {
            percentInfected = Math.max(2, 100*infected/total);
        }
    }

    percentHealthy = 100 - percentDead - percentInfected;
    if (percentHealthy < 2 && percentHealthy > 0) {
        diff = 2.0 - percentHealthy;
        percentHealthy = 2;
        percentDead -= diff/2.0;
        percentInfected -= diff/2.0;
    }
    
    barDead = document.getElementById('dead-bar');
    barDead.style.width = percentDead + "%";
    
    barInfected = document.getElementById('infected-bar');
    barInfected.style.width = percentInfected + "%";
    barInfected.style["margin-left"] = percentDead + "%";
    
    barHealthy = document.getElementById('healthy-bar');
    barHealthy.style.width = percentHealthy + "%";
    barHealthy.style["margin-left"] = (percentDead + percentInfected) + "%";

}