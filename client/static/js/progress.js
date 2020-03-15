function fill(infected, dead, healthy) {
    total = infected + dead + healthy;
    percentDead = (dead/total)*100;
    percentInfected = (infected/total)*100;
    percentHealthy = (healthy/total)*100;
    
    barDead = document.getElementById('dead-bar');
    barDead.style.width = percentDead + "%";
    
    barInfected = document.getElementById('infected-bar');
    barInfected.style.width = percentInfected + "%";
    barInfected.style["margin-left"] = percentDead + "%";
    
    barHealthy = document.getElementById('healthy-bar');
    barHealthy.style.width = percentHealthy + "%";
    barHealthy.style["margin-left"] = (percentDead + percentInfected) + "%";
}

fill(10, 50, 300);
  