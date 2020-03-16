const checkOrientation = () => {
    if(window.innerWidth > window.innerHeight){
        $("#rotate-container").hide();
    } else {
        $("#rotate-container").show();
    }
}

checkOrientation();

window.addEventListener("resize", function() {
    checkOrientation();
});