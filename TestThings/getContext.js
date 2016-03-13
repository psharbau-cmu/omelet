console.log('Here from getContext!');


window.setupAnimation = function(canvas) {
    canvsRef = canvas;
    window.theContext = canvas.getContext('2d');

    gameLoop();
};

var x = 0;
var canvsRef;

var drawThings = function() {
    x += 1;
    theContext.fillStyle = "#33eeff";

    theContext.beginPath();
    theContext.arc(x, x, 50, 0, 2 * Math.PI);
    theContext.closePath();

    theContext.fill();
};

var gameLoop = function() {
    console.log('here!');
    theContext.clearRect(0, 0, canvsRef.width, canvsRef.height);
    drawThings();
    requestAnimationFrame(gameLoop);
};