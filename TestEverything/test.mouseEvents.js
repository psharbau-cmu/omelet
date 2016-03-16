omelet.egg('test.mouseEvents', function(data, refs) {
    this.mouseEnter = function() { console.log( "Enter") ;};
    this.mouseExit = function() { console.log( "Exit") ;};
    this.mouseUp = function() { console.log( "Up") ;};
    this.mouseDown = function() { console.log( "Down") ;};
    this.mouseClick = function() { console.log( "Click") ;};
});
