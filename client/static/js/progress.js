function fill(infected, dead, healthy) {
    total = infected + dead + healthy;

    // totalNonHealthy = infected + dead;

    // logNonHealthy = Math.log(totalNonHealthy);
    // logTotal = Math.log(total);

    // percentDead = (dead/totalNonHealthy)*(logNonHealthy/logTotal)*100;
    // percentInfected = (infected/totalNonHealthy)*(logNonHealthy/logTotal)*100;
    // percentHealthy = 100 - percentDead - percentInfected;

    percentDead = 100*dead/total;
    percentInfected = 100*infected/total;
    percentHealthy = 100*healthy/total;
    
    barDead = document.getElementById('dead-bar');
    barDead.style.width = percentDead + "%";
    
    barInfected = document.getElementById('infected-bar');
    barInfected.style.width = percentInfected + "%";
    barInfected.style["margin-left"] = percentDead + "%";
    
    barHealthy = document.getElementById('healthy-bar');
    barHealthy.style.width = percentHealthy + "%";
    barHealthy.style["margin-left"] = (percentDead + percentInfected) + "%";

    countDead = document.getElementById('dead-count');
    countDead.innerHTML = dead.toLocaleString();

    countInfected = document.getElementById('infected-count');
    countInfected.innerHTML = infected.toLocaleString();
}

fill(150000, 5000, 7000000000);
  