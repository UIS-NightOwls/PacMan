/**
 * Created by bzweifel on 9/22/15.
 */
$(document).ready(function () {
    console.log("JQuery is Ready")
    setTimeout(function () {
        $("#credits").html("Credits: 1")
    }, 200);
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        var ratio = $("#canvas-container").width() / 600 ;
        console.log(ratio);
        context.scale(ratio, ratio);
      //  canvas.setAttribute('style', 'width: ' + (width * scale) + '; height: ' + (height * scale) + ';');
       // canvas.width = $("#canvas-container").width();
       // canvas.height = $("#canvas-container").height();

        /**
         * Your drawings need to be inside this function otherwise they will be reset when 
         * you resize the browser window and the canvas goes will be cleared.
         */
        //drawStuff();
    }
    resizeCanvas();


    var gridBlockSize = 20;
    var wallLineWidth = 2;
    var wallColor = "blue";
    var testGridColor = "red";


    
    var gameGridArray = [   
        'e','0','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','0','f', 
        '0','5','3','3','3','3','3','3','3','3','3','3','3','3','6','5','3','3','3','3','3','3','3','3','3','3','3','3','6','0', 
        'b','4','1','1','1','1','1','1','1','1','1','1','1','1','4','4','1','1','1','1','1','1','1','1','1','1','1','1','4','d',
        'b','4','1','5','3','3','6','1','5','3','3','3','6','1','4','4','1','5','3','3','3','6','1','5','3','3','6','1','4','d',
        'b','4','2','4','0','0','4','1','4','0','0','0','4','1','4','4','1','4','0','0','0','4','1','4','0','0','4','2','4','d',
        'b','4','1','8','3','3','7','1','8','3','3','3','7','1','8','7','1','8','3','3','3','7','1','8','3','3','7','1','4','d', 
        'b','4','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','4','d',
        'b','4','1','5','3','3','6','1','5','6','1','5','3','3','3','3','3','3','6','1','5','6','1','5','3','3','6','1','4','d',
        'b','4','1','8','3','3','7','1','4','4','1','8','3','3','6','5','3','3','7','1','4','4','1','8','3','3','7','1','4','d',
        'b','4','1','1','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','1','1','4','d',
        '0','8','3','3','3','3','6','1','4','8','3','3','6','0','4','4','0','5','3','3','7','4','1','5','3','3','3','3','7','0', 
        'h','0','a','a','a','j','4','1','4','5','3','3','7','0','4','4','0','8','3','3','6','4','1','4','i','a','a','a','0','g',
        '0','0','0','0','0','b','4','1','4','4','0','0','0','0','8','7','0','0','0','0','4','4','1','4','d','0','0','0','0','0',
        '0','c','c','c','c','k','4','1','4','4','0','0','c','c','c','c','c','c','0','0','4','4','1','4','l','c','c','c','c','0',
        '0','3','3','3','3','3','7','1','8','7','0','b','0','0','0','0','0','0','d','0','8','7','1','8','3','3','3','3','3','0',
        '0','0','0','0','0','0','0','1','0','0','0','b','0','0','0','0','0','0','d','0','0','0','1','0','0','0','0','0','0','0', 
        '0','3','3','3','3','3','6','1','5','6','0','b','0','0','0','0','0','0','d','0','5','6','1','5','3','3','3','3','3','0',
        '0','a','a','a','a','j','4','1','4','4','0','0','a','a','a','a','a','a','0','0','4','4','1','4','i','a','a','a','a','0',
        '0','0','0','0','0','b','4','1','4','4','0','0','0','0','0','0','0','0','0','0','4','4','1','4','d','0','0','0','0','0',
        'e','0','c','c','c','k','4','1','4','4','0','5','3','3','3','3','3','3','6','0','4','4','1','4','l','c','c','c','0','f',
        '0','5','3','3','3','3','7','1','8','7','0','8','3','3','6','5','3','3','7','0','8','7','1','8','3','3','3','3','6','0', 
        'b','4','1','1','1','1','1','1','1','1','1','1','1','1','4','4','1','1','1','1','1','1','1','1','1','1','1','1','4','d',
        'b','4','1','5','3','3','6','1','5','3','3','3','6','1','4','4','1','5','3','3','3','6','1','5','3','3','6','1','4','d',
        'b','4','1','8','3','6','4','1','8','3','3','3','7','1','8','7','1','8','3','3','3','7','1','4','5','3','7','1','4','d',
        'b','4','2','1','1','4','4','1','1','1','1','1','1','1','0','0','1','1','1','1','1','1','1','4','4','1','1','2','4','d',
        'b','8','3','6','1','4','4','1','5','6','1','5','3','3','3','3','3','3','6','1','5','6','1','4','4','1','5','3','7','d', 
        'b','5','3','7','1','8','7','1','4','4','1','8','3','3','6','5','3','3','7','1','4','4','1','8','7','1','8','3','6','d',
        'b','4','1','1','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','4','4','1','1','1','1','1','1','4','d',
        'b','4','1','5','3','3','3','3','7','8','3','3','6','1','4','4','1','5','3','3','7','8','3','3','3','3','6','1','4','d',
        'b','4','1','8','3','3','3','3','3','3','3','3','7','1','8','7','1','8','3','3','3','3','3','3','3','3','7','1','4','d',
        'b','4','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','4','d',
        '0','8','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','3','7','0',
        'h','0','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','0','g'
        ];
    
    function renderContent(){
        context.save();
        //draw things
        //drawTestGrid(testGridColor);
        drawGame();

        context.restore();
    }
    function drawTestGrid(color){
        context.save();
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
        context.restore();
    }
    
    function drawGame(){
        var maxGridx = canvas.width / gridBlockSize;
        var maxGridy = canvas.height / gridBlockSize;
        var gridCount = 0;
        for(var y=0; y <= maxGridy; y++){
            for(var x=0; x < maxGridx;x++){
                switch (gameGridArray[gridCount]){
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
                    default :
                        break;
                }
                gridCount++;
            }
        }
    }
    
    function drawHorizontalWall(gridX, gridY){
        // starting (x,y) pixels
        var startX = gridX * gridBlockSize;
        var startY = gridY * gridBlockSize + (gridBlockSize/2);
        
        // create a line based
        createWall(startX,startY,startX+gridBlockSize,startY);
    }
    
    function drawVerticalWall(gridX, gridY){
        // starting (x,y) pixels
        var startX = gridX * gridBlockSize + (gridBlockSize/2);
        var startY = gridY * gridBlockSize ;

        // create a line based
        createWall(startX,startY,startX,startY+gridBlockSize);
    }
    
    function drawBottomLeftArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize;
        var centerY = gridY * gridBlockSize + gridBlockSize;
        
        //create arc
        createArc(centerX, centerY, gridBlockSize/2, 1.5 * Math.PI, 0); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    }
    
    function drawBottomRightArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize + gridBlockSize;
        var centerY = gridY * gridBlockSize + gridBlockSize;

        //create arc
        createArc(centerX, centerY, gridBlockSize/2, Math.PI, 1.5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    }
    
    function drawTopLeftArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize;
        var centerY = gridY * gridBlockSize;

        //create arc
        createArc(centerX, centerY, gridBlockSize/2, 0, .5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    }
    
    function drawTopRightArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize + gridBlockSize;
        var centerY = gridY * gridBlockSize;

        //create arc
        createArc(centerX, centerY, gridBlockSize/2, .5 * Math.PI, Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    }
    
    function drawPacDot(gridX, gridY){
        context.save();
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

        context.restore();
    }
    
     function drawPacPowerDots(gridX, gridY){
         context.save();
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

         context.restore();
     }
    
    function drawOuterWallRight(gridX,gridY){
        // starting (x,y) pixels
        var startX = gridX * gridBlockSize + gridBlockSize;
        var startY = gridY * gridBlockSize ;

        // create a line based
        createWall(startX,startY,startX,startY+gridBlockSize);
    }
    
    function drawOuterWallLeft(gridX,gridY){
        // starting (x,y) pixels
        var startX = gridX * gridBlockSize;
        var startY = gridY * gridBlockSize ;

        // create a line based
        createWall(startX,startY,startX,startY+gridBlockSize);
    }

    function drawOuterWallBottom(gridX,gridY){
        // starting (x,y) pixels
        var startX = gridX * gridBlockSize ;
        var startY = gridY * gridBlockSize + gridBlockSize;

        // create a line based
        createWall(startX,startY,startX+gridBlockSize, startY);
    }

    function drawOuterWallTop(gridX,gridY){
        // starting (x,y) pixels
        var startX = gridX * gridBlockSize ;
        var startY = gridY * gridBlockSize ;

        // create a line based
        createWall(startX,startY,startX+gridBlockSize,startY);
    }
    
    function drawOuterWallTopLeft(gridX,gridY){
        drawOuterWallTop(gridX,gridY);
        drawOuterWallLeft(gridX,gridY);
    }
    function drawOuterWallBottomLeft(gridX,gridY){
        drawOuterWallBottom(gridX,gridY);
        drawOuterWallLeft(gridX,gridY);
    }
    function drawOuterWallTopRight(gridX,gridY){
        drawOuterWallTop(gridX,gridY);
        drawOuterWallRight(gridX,gridY);
    }
    function drawOuterWallBottomRight(gridX,gridY){
        drawOuterWallBottom(gridX,gridY);
        drawOuterWallRight(gridX,gridY);
    }

    function drawOuterBottomLeftArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize - gridBlockSize;
        var centerY = gridY * gridBlockSize + gridBlockSize*2;

        //create arc
        createArc(centerX, centerY, gridBlockSize, 1.5 * Math.PI, 0); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    }
    
    function drawOuterBottomRightArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize + gridBlockSize*2;
        var centerY = gridY * gridBlockSize + gridBlockSize*2;

        //create arc
        createArc(centerX, centerY, gridBlockSize, Math.PI, 1.5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)

    }
    
    function drawOuterTopLeftArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize - gridBlockSize;
        var centerY = gridY * gridBlockSize - gridBlockSize;

        //create arc
        createArc(centerX, centerY, gridBlockSize, 0, .5 * Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    }
    
    function drawOuterTopRightArc(gridX, gridY){
        //starting (x,y) pixels
        var centerX = gridX * gridBlockSize + gridBlockSize*2;
        var centerY = gridY * gridBlockSize - gridBlockSize;

        //create arc
        createArc(centerX, centerY, gridBlockSize, .5 * Math.PI, Math.PI); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
    }
    
    function createArc(centerX, centerY, radius, radianStart, radianEnd){
        context.save();
        context.lineWidth = wallLineWidth;
        context.strokeStyle = wallColor;
        
        context.beginPath();
        context.arc(centerX, centerY, radius, radianStart, radianEnd); // arc(X-center, y-center, radius, starting angle in radians, ending angle in radians)
        context.stroke();

        context.restore();
    }
    
    function createWall(startX, startY, endX, endY){
        context.save();
        context.lineWidth = wallLineWidth;
        context.strokeStyle = wallColor;

        // create a line based
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX , endY);
        context.closePath();
        context.stroke();

        context.restore();
    }

   

  
       
   
    function drawSprite(img, x, y, dir) {
        context.drawImage(img, x, y);
    }
 
    var spriteSize = 32;
    var img = new Image();
    img.src = "images/sprites/pacman-right-1.png";

    img.onload = function () {
        renderContent();
        drawSprite(img, 300 - spriteSize / 2, 490 - spriteSize / 2, null);
    }

    var ghost1 = new Image();
    ghost1.src = "images/sprites/ghost1-right.png";

    ghost1.onload = function () {
        renderContent();
        drawSprite(ghost1, 266 - spriteSize / 2, 300 - spriteSize / 2, null);
    }

    var ghost2 = new Image();
    ghost2.src = "images/sprites/ghost2-right.png";

    ghost2.onload = function () {
        renderContent();
        drawSprite(ghost2, 300 - spriteSize / 2, 300 - spriteSize / 2, null);
    }

    var ghost3 = new Image();
    ghost3.src = "images/sprites/ghost3-right.png";

    ghost3.onload = function () {
        renderContent();
        drawSprite(ghost3, 334 - spriteSize / 2, 300 - spriteSize / 2, null);
    }

    var ghost4 = new Image();
    ghost4.src = "images/sprites/ghost4-right.png";

    ghost4.onload = function () {
        renderContent();
        drawSprite(ghost4, 300 - spriteSize / 2, 334 - spriteSize / 2, null);
    }

    function keyEventListener(event) {
        var x = event.keyCode;
        console.log("keyCode:",x);
        if (x == 83) {  // 83 is the 's' key
            
          document.getElementById("song1").play();
        }
    }
    document.body.addEventListener("keyup", keyEventListener, false);
  
});