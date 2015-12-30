/**
 * Created by bzweifel on 10/24/15.
 */
var dotsRemaining = 0;


/*******************************
* Game Board Object
* (Requirements 1.3.1) 
*******************************/
var startingGameGridArray = [
    //   1           4   5                   10                 15                   20                 25              29
    'e','0','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','0','f',
    '0','5','3','3','3','3','3','3','3','3','3','3','3','3','6','5','3','3','3','3','3','3','3','3','3','3','3','3','6','0',
    'b','4','1','1','1','1','1','1','1','1','1','1','1','1','4','4','1','1','1','1','1','1','1','1','1','1','1','1','4','d',
    'b','4','1','5','3','3','6','1','5','3','3','3','6','1','4','4','1','5','3','3','3','6','1','5','3','3','6','1','4','d',
    'b','4','2','4','0','0','4','1','4','0','0','0','4','1','4','4','1','4','0','0','0','4','1','4','0','0','4','2','4','d',

    //   1           4   5                   10                 15                   20                 25              29
    'b','4','1','8','3','3','7','1','8','3','3','3','7','1','8','7','1','8','3','3','3','7','1','8','3','3','7','1','4','d', //5
    'b','4','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','4','d',
    'b','4','1','5','3','3','6','1','5','6','1','5','3','3','3','3','3','3','6','1','5','6','1','5','3','3','6','1','4','d',
    'b','4','1','8','3','3','7','1','4','4','1','8','3','3','6','5','3','3','7','1','4','4','1','8','3','3','7','1','4','d',
    'b','4','1','1','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','1','1','4','d',

    //   1           4   5                   10                 15                   20                 25              29
    '0','8','3','3','3','3','6','1','4','8','3','3','6','0','4','4','0','5','3','3','7','4','1','5','3','3','3','3','7','0', //10
    'h','0','a','a','a','j','4','1','4','5','3','3','7','0','8','7','0','8','3','3','6','4','1','4','i','a','a','a','0','g',
    '0','0','0','0','0','b','4','1','4','4','0','0','0','0','0','0','0','0','0','0','4','4','1','4','d','0','0','0','0','0',
    '0','c','c','c','c','k','4','1','4','4','0','e','c','c','c','c','c','c','f','0','4','4','1','4','l','c','c','c','c','0',
    'z','3','3','3','3','3','7','1','8','7','0','b','0','0','0','0','0','0','d','0','8','7','1','8','3','3','3','3','3','z',

    //   1           4   5                   10                 15                   20                 25              29
    '0','0','0','0','0','0','0','1','0','0','0','b','0','0','0','0','0','0','d','0','0','0','1','0','0','0','0','0','0','0', //15
    'z','3','3','3','3','3','6','1','5','6','0','b','0','0','0','0','0','0','d','0','5','6','1','5','3','3','3','3','3','z',
    '0','a','a','a','a','j','4','1','4','4','0','h','a','a','a','a','a','a','g','0','4','4','1','4','i','a','a','a','a','0',
    '0','0','0','0','0','b','4','1','4','4','0','0','0','0','0','0','0','0','0','0','4','4','1','4','d','0','0','0','0','0',
    'e','0','c','c','c','k','4','1','4','4','0','5','3','3','3','3','3','3','6','0','4','4','1','4','l','c','c','c','0','f',

    //   1           4   5                   10                 15                   20                 25              29
    '0','5','3','3','3','3','7','1','8','7','0','8','3','3','6','5','3','3','7','0','8','7','1','8','3','3','3','3','6','0', //20
    'b','4','1','1','1','1','1','1','1','1','1','1','1','1','4','4','1','1','1','1','1','1','1','1','1','1','1','1','4','d',
    'b','4','1','5','3','3','6','1','5','3','3','3','6','1','4','4','1','5','3','3','3','6','1','5','3','3','6','1','4','d',
    'b','4','1','8','3','6','4','1','8','3','3','3','7','1','8','7','1','8','3','3','3','7','1','4','5','3','7','1','4','d',
    'b','4','2','1','1','4','4','1','1','1','1','1','1','1','0','0','1','1','1','1','1','1','1','4','4','1','1','2','4','d',

    //   1           4   5                   10                 15                   20                 25              29
    'b','8','3','6','1','4','4','1','5','6','1','5','3','3','3','3','3','3','6','1','5','6','1','4','4','1','5','3','7','d', //25
    'b','5','3','7','1','8','7','1','4','4','1','8','3','3','6','5','3','3','7','1','4','4','1','8','7','1','8','3','6','d',
    'b','4','1','1','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','1','1','4','d',
    'b','4','1','5','3','3','3','3','7','8','3','3','6','1','4','4','1','5','3','3','7','8','3','3','3','3','6','1','4','d',
    'b','4','1','8','3','3','3','3','3','3','3','3','7','1','8','7','1','8','3','3','3','3','3','3','3','3','7','1','4','d',
    'b','4','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','4','d', //30
    '0','8','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','7','0',
    'h','0','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','0','g'
];
//var startingGameGridArray = [
//    //   1           4   5                   10                 15                   20                 25              29
//    'e','0','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','0','f',
//    '0','5','3','3','3','3','3','3','3','3','3','3','3','3','6','5','3','3','3','3','3','3','3','3','3','3','3','3','6','0',
//    'b','4','0','0','0','0','0','0','0','0','0','0','0','0','4','4','0','0','0','0','0','0','0','0','0','0','0','0','4','d',
//    'b','4','0','5','3','3','6','0','5','3','3','3','6','0','4','4','0','5','3','3','3','6','0','5','3','3','6','0','4','d',
//    'b','4','0','4','0','0','4','0','4','0','0','0','4','0','4','4','0','4','0','0','0','4','0','4','0','0','4','0','4','d',
//
//    //   0           4   5                   00                 05                   00                 05              09
//    'b','4','0','8','3','3','7','0','8','3','3','3','7','0','8','7','0','8','3','3','3','7','0','8','3','3','7','0','4','d', //5
//    'b','4','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','4','d',
//    'b','4','0','5','3','3','6','0','5','6','0','5','3','3','3','3','3','3','6','0','5','6','0','5','3','3','6','0','4','d',
//    'b','4','0','8','3','3','7','0','4','4','0','8','3','3','6','5','3','3','7','0','4','4','0','8','3','3','7','0','4','d',
//    'b','4','0','0','0','0','0','0','4','4','0','0','0','0','4','4','0','0','0','0','4','4','0','0','0','0','0','0','4','d',
//
//    //   0           4   5                   00                 05                   00                 05              09
//    '0','8','3','3','3','3','6','0','4','8','3','3','6','0','4','4','0','5','3','3','7','4','0','5','3','3','3','3','7','0', //00
//    'h','0','a','a','a','j','4','0','4','5','3','3','7','0','8','7','0','8','3','3','6','4','0','4','i','a','a','a','0','g',
//    '0','0','0','0','0','b','4','0','4','4','0','0','0','0','0','0','0','0','0','0','4','4','0','4','d','0','0','0','0','0',
//    '0','c','c','c','c','k','4','0','4','4','0','e','c','c','c','c','c','c','f','0','4','4','0','4','l','c','c','c','c','0',
//    'z','3','3','3','3','3','7','0','8','7','0','b','0','0','0','0','0','0','d','0','8','7','0','8','3','3','3','3','3','z',
//
//    //   0           4   5                   00                 05                   00                 05              09
//    '0','0','0','0','0','0','0','0','0','0','0','b','0','0','0','0','0','0','d','0','0','0','0','0','0','0','0','0','0','0', //05
//    'z','3','3','3','3','3','6','0','5','6','0','b','0','0','0','0','0','0','d','0','5','6','0','5','3','3','3','3','3','z',
//    '0','a','a','a','a','j','4','0','4','4','0','h','a','a','a','a','a','a','g','0','4','4','0','4','i','a','a','a','a','0',
//    '0','0','0','0','0','b','4','0','4','4','0','0','0','0','0','0','0','0','0','0','4','4','0','4','d','0','0','0','0','0',
//    'e','0','c','c','c','k','4','0','4','4','0','5','3','3','3','3','3','3','6','0','4','4','0','4','l','c','c','c','0','f',
//
//    //   0           4   5                   00                 05                   00                 05              09
//    '0','5','3','3','3','3','7','0','8','7','0','8','3','3','6','5','3','3','7','0','8','7','0','8','3','3','3','3','6','0', //00
//    'b','4','0','0','0','0','0','0','0','0','0','0','0','0','4','4','0','0','0','0','0','0','0','0','0','0','0','0','4','d',
//    'b','4','0','5','3','3','6','0','5','3','3','3','6','0','4','4','0','5','3','3','3','6','0','5','3','3','6','0','4','d',
//    'b','4','0','8','3','6','4','0','8','3','3','3','7','0','8','7','0','8','3','3','3','7','0','4','5','3','7','0','4','d',
//    'b','4','0','0','0','4','4','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','4','4','0','0','0','4','d',
//
//    //   1           4   5                   10                 15                   00                 05              09
//    'b','8','3','6','0','4','4','0','5','6','0','5','3','3','3','3','3','3','6','1','5','6','0','4','4','0','5','3','7','d', //05
//    'b','5','3','7','0','8','7','0','4','4','0','8','3','3','6','5','3','3','7','0','4','4','0','8','7','0','8','3','6','d',
//    'b','4','0','0','0','0','0','0','4','4','0','0','0','0','4','4','0','0','0','0','4','4','0','0','0','0','0','0','4','d',
//    'b','4','0','5','3','3','3','3','7','8','3','3','6','0','4','4','0','5','3','3','7','8','3','3','3','3','6','0','4','d',
//    'b','4','0','8','3','3','3','3','3','3','3','3','7','0','8','7','0','8','3','3','3','3','3','3','3','3','7','0','4','d',
//    'b','4','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','4','d', //30
//    '0','8','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','7','0',
//    'h','0','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','0','g'
//];

var gameGridArray = [];
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var blocksPerRow = 30;
var gridBlockSize = canvas.width/blocksPerRow;
var wallLineWidth = 2;
var maxDots = 0;

setTimeout(function () {
    $("#credits").html("Credits: 1")
}, 200);

//document.body.style.zoom=.75;
//this.blur();

var wallColor = "blue";
var testGridColor = "red";

/*******************************
* Game Grid Render Board
* (Requirements 3.1, Requirements 1.3.2) 
*******************************/
function renderBoard(){
    context.save();
    //draw things
    //drawTestGrid(testGridColor);
    gameGridArray = startingGameGridArray.slice();
    drawGame(gameGridArray);
    maxDots = dotsRemaining;
    context.restore();
}

function drawTestGrid(color){
    context.lineWidth = 1;
    context.strokeStyle = color;

    // horizontal grid lines
    for(var i = 0; i <= canvas.height; i = i + gridBlockSize)
    {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
        context.closePath();
        context.stroke();
    }
    // vertical grid lines
    for(var j = 0; j <= canvas.width; j = j + gridBlockSize)
    {
        context.beginPath();
        context.moveTo(j, 0);
        context.lineTo(j, canvas.height);
        context.closePath();
        context.stroke();
    }
}

/*******************************
* Game Grid
* (Requirements 3.1.1 - 3.1.21) 
*******************************/
function drawGame(gameGrid){
    var maxGridx = canvas.width / gridBlockSize;
    var maxGridy = canvas.height / gridBlockSize;
    var gridCount = 0;
    dotsRemaining = 0;

    for(var y=0; y <= maxGridy; y++){
        for(var x=0; x < maxGridx;x++){
            switch (gameGrid[gridCount]){
                case '0':
                    break;
                case '1':
                    drawPacDot(x,y);
                    break;
                case '2':
                    drawPacPowerDots(x,y);
                    break;
                case '3':
                    drawHorizontalWall(x,y);
                    break;
                case '4':
                    drawVerticalWall(x,y);
                    break;
                case '5':
                    drawBottomRightArc(x,y);
                    break;
                case '6':
                    drawBottomLeftArc(x,y);
                    break;
                case '7':
                    drawTopLeftArc(x,y);
                    break;
                case '8':
                    drawTopRightArc(x,y);
                    break;
                case 'a':
                    drawOuterWallTop(x,y);
                    break;
                case 'b':
                    drawOuterWallRight(x,y);
                    break;
                case 'c':
                    drawOuterWallBottom(x,y);
                    break;
                case 'd':
                    drawOuterWallLeft(x,y);
                    break;
                case 'e':
                    drawOuterBottomRightArc(x,y);
                    break;
                case 'f':
                    drawOuterBottomLeftArc(x,y);
                    break;
                case 'g':
                    drawOuterTopLeftArc(x,y);
                    break;
                case 'h':
                    drawOuterTopRightArc(x,y);
                    break;
                case'i':
                    drawOuterWallTopLeft(x,y);
                    break;
                case 'j':
                    drawOuterWallTopRight(x,y);
                    break;
                case 'k':
                    drawOuterWallBottomRight(x,y);
                    break;
                case 'l':
                    drawOuterWallBottomLeft(x,y);
                    break;
                default:
                    /*******************************
                    * Grid Empty
                    * (Requirements 3.1.1) 
                    *******************************/
                    break;
            }
            gridCount++;
        }
    }
}

/*******************************
* Game Grid
* (Requirements 3.1.4) 
*******************************/
function drawHorizontalWall(gridX, gridY){
    // starting (x,y) pixels
    var startX = gridX * gridBlockSize;
    var startY = gridY * gridBlockSize + (gridBlockSize/2);

    // create a line based
    createWall(startX,startY,startX+gridBlockSize,startY);
}

/*******************************
* Game Grid
* (Requirements 3.1.5) 
*******************************/
function drawVerticalWall(gridX, gridY){
    // starting (x,y) pixels
    var startX = gridX * gridBlockSize + (gridBlockSize/2);
    var startY = gridY * gridBlockSize ;

    // create a line based
    createWall(startX,startY,startX,startY+gridBlockSize);
}

/*******************************
* Game Grid
* (Requirements 3.1.7) 
*******************************/
function drawBottomLeftArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize;
    var centerY = gridY * gridBlockSize + gridBlockSize;

    //create arc
    createArc(centerX, centerY, gridBlockSize/2, 1.5 * Math.PI, 0); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

/*******************************
* Game Grid
* (Requirements 3.1.6) 
*******************************/
function drawBottomRightArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize + gridBlockSize;
    var centerY = gridY * gridBlockSize + gridBlockSize;

    //create arc
    createArc(centerX, centerY, gridBlockSize/2, Math.PI, 1.5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

/*******************************
* Game Grid
* (Requirements 3.1.9) 
*******************************/
function drawTopLeftArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize;
    var centerY = gridY * gridBlockSize;

    //create arc
    createArc(centerX, centerY, gridBlockSize/2, 0, .5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

/*******************************
* Game Grid
* (Requirements 3.1.8) 
*******************************/
function drawTopRightArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize + gridBlockSize;
    var centerY = gridY * gridBlockSize;

    //create arc
    createArc(centerX, centerY, gridBlockSize/2, .5 * Math.PI, Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

/*******************************
* Game Grid
* (Requirements 3.1.2) 
*******************************/
function drawPacDot(gridX, gridY){
    context.lineWidth = wallLineWidth;
    context.strokeStyle = "yellow";

    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize + gridBlockSize/2;
    var centerY = gridY * gridBlockSize + gridBlockSize/2;

    //create arc
    context.beginPath();
    context.arc(centerX, centerY, gridBlockSize/(gridBlockSize/2), 0, 2*Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
    context.stroke();
    
    dotsRemaining = dotsRemaining + 1;
}

/*******************************
* Game Grid
* (Requirements 3.1.3) 
*******************************/
function drawPacPowerDots(gridX, gridY){
    context.lineWidth = wallLineWidth;
    context.strokeStyle = "yellow";

    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize + gridBlockSize/2;
    var centerY = gridY * gridBlockSize + gridBlockSize/2;

    //create arc
    context.beginPath();
    context.arc(centerX, centerY, gridBlockSize/2, 0, 2*Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
    context.stroke();

    dotsRemaining = dotsRemaining + 1;
}

/*******************************
* Game Grid
* (Requirements 3.1.11) 
*******************************/
function drawOuterWallRight(gridX,gridY){
    // starting (x,y) pixels
    var startX = gridX * gridBlockSize + gridBlockSize;
    var startY = gridY * gridBlockSize ;

    // create a line based
    createWall(startX,startY,startX,startY+gridBlockSize);
}

/*******************************
* Game Grid
* (Requirements 3.1.13) 
*******************************/
function drawOuterWallLeft(gridX,gridY){
    // starting (x,y) pixels
    var startX = gridX * gridBlockSize;
    var startY = gridY * gridBlockSize ;

    // create a line based
    createWall(startX,startY,startX,startY+gridBlockSize);
}


/*******************************
* Game Grid
* (Requirements 3.1.12) 
*******************************/
function drawOuterWallBottom(gridX,gridY){
    // starting (x,y) pixels
    var startX = gridX * gridBlockSize ;
    var startY = gridY * gridBlockSize + gridBlockSize;

    // create a line based
    createWall(startX,startY,startX+gridBlockSize, startY);
}

/*******************************
* Game Grid
* (Requirements 3.1.10) 
*******************************/
function drawOuterWallTop(gridX,gridY){
    // starting (x,y) pixels
    var startX = gridX * gridBlockSize ;
    var startY = gridY * gridBlockSize ;

    // create a line based
    createWall(startX,startY,startX+gridBlockSize,startY);
}

/*******************************
* Game Grid
* (Requirements 3.1.19) 
*******************************/
function drawOuterWallTopLeft(gridX,gridY){
    drawOuterWallTop(gridX,gridY);
    drawOuterWallLeft(gridX,gridY);
}

/*******************************
* Game Grid
* (Requirements 3.1.20) 
*******************************/
function drawOuterWallBottomLeft(gridX,gridY){
    drawOuterWallBottom(gridX,gridY);
    drawOuterWallLeft(gridX,gridY);
}

/*******************************
* Game Grid
* (Requirements 3.1.18) 
*******************************/
function drawOuterWallTopRight(gridX,gridY){
    drawOuterWallTop(gridX,gridY);
    drawOuterWallRight(gridX,gridY);
}

/*******************************
* Game Grid
* (Requirements 3.1.21) 
*******************************/
function drawOuterWallBottomRight(gridX,gridY){
    drawOuterWallBottom(gridX,gridY);
    drawOuterWallRight(gridX,gridY);
}

/*******************************
* Game Grid
* (Requirements 3.1.15) 
*******************************/
function drawOuterBottomLeftArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize - gridBlockSize;
    var centerY = gridY * gridBlockSize + gridBlockSize*2;

    //create arc
    createArc(centerX, centerY, gridBlockSize, 1.5 * Math.PI, 0); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

/*******************************
* Game Grid
* (Requirements 3.1.14) 
*******************************/
function drawOuterBottomRightArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize + gridBlockSize*2;
    var centerY = gridY * gridBlockSize + gridBlockSize*2;

    //create arc
    createArc(centerX, centerY, gridBlockSize, Math.PI, 1.5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

/*******************************
* Game Grid
* (Requirements 3.1.17) 
*******************************/
function drawOuterTopLeftArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize - gridBlockSize;
    var centerY = gridY * gridBlockSize - gridBlockSize;

    //create arc
    createArc(centerX, centerY, gridBlockSize, 0, .5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

/*******************************
* Game Grid
* (Requirements 3.1.16) 
*******************************/
function drawOuterTopRightArc(gridX, gridY){
    //starting (x,y) pixels
    var centerX = gridX * gridBlockSize + gridBlockSize*2;
    var centerY = gridY * gridBlockSize - gridBlockSize;

    //create arc
    createArc(centerX, centerY, gridBlockSize, .5 * Math.PI, Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
}

function createArc(centerX, centerY, radius, radianStart, radianEnd){
    context.lineWidth = wallLineWidth;
    context.strokeStyle = wallColor;

    context.beginPath();
    context.arc(centerX, centerY, radius, radianStart, radianEnd); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    context.stroke();
}

function createWall(startX, startY, endX, endY){
    context.lineWidth = wallLineWidth;
    context.strokeStyle = wallColor;

    // create a line based
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX , endY);
    context.closePath();
    context.stroke();
}

renderBoard();
