$(document).keydown(function(e) {
    switch(e.which) {
        case 32: // space
            playPause();
            break;

        case 37: // left arrow key
            prevDay();
            window.keyPressed = true;
            break;

        case 39: // right arrow key
            nextDay();
            window.keyPressed = true;

            break;

        default: return;
    }
    
    e.preventDefault();
});

$(document).keyup(function(e) {
    switch(e.which) {
        case 37: // left arrow key
            update();
            window.keyPressed = false;
            break;

        case 39: // right arrow key
            update();
            window.keyPressed = false;
            break;

        default: return;
    }
    
    e.preventDefault();
});