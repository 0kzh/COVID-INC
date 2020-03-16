const checkOrientation = () => {
    if(window.innerWidth > window.innerHeight){
        $("#rotate-container").hide();
    } else {
        $("#rotate-container").show();
    }
}

checkOrientation();