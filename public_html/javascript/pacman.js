/**
 * Created by bzweifel on 9/22/15.
 */
$(document).ready(function(){
    console.log("JQuery is Ready")
    setTimeout(function () {
        $("#credits").html("Credits: 1")
    }, 200);
    var pacManCanvas = document.getElementById("pacMan");
    var pacManContext = pacManCanvas.getContext("2d");
    
    var ghost1Canvas = document.getElementById("ghost1");
    var ghost1Context = ghost1Canvas.getContext("2d");

    var ghost2Canvas = document.getElementById("ghost2");
    var ghost2Context = ghost2Canvas.getContext("2d");

    var ghost3Canvas = document.getElementById("ghost3");
    var ghost3Context = ghost3Canvas.getContext("2d");

    var ghost4Canvas = document.getElementById("ghost4");
    var ghost4Context = ghost4Canvas.getContext("2d");

    var spriteSize = 32;

    var gameStarted = false;
    
    function renderContent(){
        context.save();
        pacImg.onload = function(){
           drawPacMan(); 
        }; 
        ghost1.onload = function(){
            drawGhost1();
        };
        ghost2.onload = function(){
            drawGhost2();
        };
        ghost3.onload = function(){
            drawGhost3();
        };
        ghost4.onload = function(){
            drawGhost4();   
        };
        context.restore();
    }
    
    var character = function(){
        this.gridX           = 15;
        this.gridY           = 24;
        this.coordX          = this.gridX * gridBlockSize;
        this.coordY          = this.gridY * gridBlockSize + gridBlockSize/2;
        // characters velocity is displacement/milliseconds ( 5px per 100 milliseconds)
        this.displacement    = 5;       //in pixels needs to be a factor of gridBlockSize 
        this.milliseconds     = 100;    // change this first to make character move faster or slower
        this.curDirection    = "right";
        this.desDirection    = "right";
    };
    
    var pacMan = new character();
    var blinky = new character();
    var inky = new character();
    var clyde = new character();
    var pinky = new character();
    
    // Set or change defaults for characters
    blinky.coordX = 266;
    blinky.gridX =  blinky.coordX / gridBlockSize;
    blinky.coordY = 300;
    blinky.gridY = (blinky.coordY - gridBlockSize/2) / gridBlockSize;

    inky.coordX = 300;
    inky.gridX =  inky.coordX / gridBlockSize;
    inky.coordY = 300;
    inky.gridY = (inky.coordY - gridBlockSize/2) / gridBlockSize;

    clyde.coordX = 334;
    clyde.gridX =  clyde.coordX / gridBlockSize;
    clyde.coordY = 300;
    clyde.gridY = (clyde.coordY - gridBlockSize/2) / gridBlockSize;
    
    pinky.coordX = 300;
    pinky.gridX =  pinky.coordX / gridBlockSize;
    pinky.coordY = 334;
    pinky.gridY = (pinky.coordY - gridBlockSize/2) / gridBlockSize;
    
    // Images
    var pacImg = new Image();
    pacImg.src = "images/sprites/pacman-right-1.png";

    var ghost1 = new Image();
    ghost1.src = "images/sprites/ghost1-right.png";

    var ghost2 = new Image();
    ghost2.src = "images/sprites/ghost2-right.png";

    var ghost3 = new Image();
    ghost3.src = "images/sprites/ghost3-right.png";

    var ghost4 = new Image();
    ghost4.src = "images/sprites/ghost4-right.png";
    

    function drawSprite(img, x, y, dir, charContext) {
        charContext.drawImage(img, x, y);
    }
    
    function drawPacMan(){
        drawSprite(pacImg, pacMan.coordX - spriteSize / 2, pacMan.coordY - spriteSize / 2, pacMan.curDirection, pacManContext);
    }

    // Blinky - Red - ghost 1
    // Inky - blue - ghost 2
    // Clyde - orange - ghost 3
    // Pinky - pink - ghost 4
    
    function drawGhost1(){
        drawSprite(ghost1, blinky.coordX - spriteSize / 2, blinky.coordY - spriteSize / 2, blinky.curDirection, ghost1Context);
    }
    
    function drawGhost2(){
        drawSprite(ghost2, inky.coordX - spriteSize / 2, inky.coordY - spriteSize / 2, inky.curDirection, ghost2Context);
    }
    
    function drawGhost3(){
        drawSprite(ghost3, clyde.coordX - spriteSize / 2, clyde.coordY - spriteSize / 2, clyde.curDirection, ghost3Context);
    }
    
    function drawGhost4(){
        drawSprite(ghost4, pinky.coordX - spriteSize / 2, pinky.coordY - spriteSize / 2, pinky.curDirection, ghost4Context);
    }
    
    // User moves Pac Man
    function checkKey(e){
        e = e || window.event;
        switch (e.keyCode){
            case 38:	// UP Arrow Key pressed
            case 87:	// W pressed
                pacMan.desDirection = "up";
                break;
            case 40:	// DOWN Arrow Key pressed
            case 83:	// S pressed 
                pacMan.desDirection = "down";
                break;
            case 37:	// LEFT Arrow Key pressed
            case 65:	// A pressed
                pacMan.desDirection = "left";
                break;
            case 39:	// RIGHT Arrow Key pressed
            case 68:	// D pressed
                pacMan.desDirection = "right";
                break;
            default :
                break;
        }
        if(!gameStarted || !pacMan.isMoving){
            gameStarted = true;
            movePacMan();
        }
    }
    function movePacMan(){
        pacMan.isMoving = true;
        if(isCharacterInCenter(pacMan)){
            if(canCharacterMoveInDirection(pacMan, pacMan.desDirection)){
                pacMan.curDirection = pacMan.desDirection;
                moveCharInCurrentDirection(pacMan);
            }
            else{
                if(canCharacterMoveInDirection(pacMan, pacMan.curDirection)){
                    pacMan.desDirection = pacMan.curDirection;
                    moveCharInCurrentDirection(pacMan);
                }
                else{
                    // stop PacMan
                    pacMan.isMoving = false;
                }
            }
        }
        else{
            moveCharInCurrentDirection(pacMan);
        }
        
        if(pacMan.isMoving){
            setTimeout(function(){
                movePacMan();
            }, pacMan.milliseconds);
        }
    }
    
    // Below are functions to be used by Ghosts and PacMan
    function moveCharInCurrentDirection(char){
        switch (char.curDirection){
            case 'up':
                moveCharacterUp(char);
                break;
            case 'down':
                moveCharacterDown(char);
                break;
            case 'right':
                moveCharacterRight(char);
                break;
            case 'left':
                moveCharacterLeft(char);
                break;
            default:
                return false;
        }
    }
    function moveCharacterRight(char){
        var tempCoordX = char.coordX + char.displacement;
        moveCharacterHorizontal(tempCoordX, char);
    }
    function moveCharacterLeft(char){
        var tempCoordX = char.coordX - char.displacement;
        moveCharacterHorizontal(tempCoordX, char);
    }
    function moveCharacterHorizontal(x, char){
        var tempGridX = Math.floor(x / gridBlockSize);
        var gameGridIndex = char.gridY * blocksPerRow + tempGridX;
        var previousCoordX = char.gridX * gridBlockSize;
        var previousCoordY = char.gridY * gridBlockSize;
    
        gameGridArray[gameGridIndex] = "0";
        char.coordX = x;
        char.gridX = tempGridX;
        //Power up
        
        document.getElementById("debug-help2").innerHTML = gameGridArray[gameGridIndex-1] + " " + gameGridArray[gameGridIndex] + " " + gameGridArray[gameGridIndex+1];

        context.clearRect(previousCoordX-wallLineWidth,previousCoordY-wallLineWidth,gridBlockSize+wallLineWidth*2,gridBlockSize+wallLineWidth*2);
        pacManContext.clearRect(0,0,pacManCanvas.width,pacManCanvas.height);
        
        drawPacMan();
    }
    function moveCharacterUp(char){
        var tempCoordY = char.coordY - char.displacement;
        moveCharacterVertical(tempCoordY, char);
    }
    function moveCharacterDown(char){
        var tempCoordY = char.coordY + char.displacement;
        
        moveCharacterVertical(tempCoordY, char);
    }
    function moveCharacterVertical(y, char){
        var tempGridY = Math.floor(y / gridBlockSize);
        var gameGridIndex = tempGridY * blocksPerRow + pacMan.gridX;
        var previousCoordX = char.gridX * gridBlockSize;
        var previousCoordY = char.gridY * gridBlockSize;
        
        gameGridArray[gameGridIndex] = "0";
        char.coordY = y;
        char.gridY = tempGridY;
        
        document.getElementById("debug-help2").innerHTML = gameGridArray[gameGridIndex-1] + " " + gameGridArray[gameGridIndex] + " " + gameGridArray[gameGridIndex+1];
        context.clearRect(previousCoordX-wallLineWidth,previousCoordY-wallLineWidth,gridBlockSize+wallLineWidth*2,gridBlockSize+wallLineWidth*2);
        pacManContext.clearRect(0,0,pacManCanvas.width,pacManCanvas.height);
        drawPacMan();
    }
    function isCharacterInCenter(character){
        return (
            (character.coordX == character.gridX * gridBlockSize + gridBlockSize/2)
            &&
            (character.coordY == character.gridY * gridBlockSize + gridBlockSize/2)
        )
    }
    function canCharacterMoveInDirection(character, direction){
        var gameGridIndex;
        switch (direction){
            case 'up':
                gameGridIndex = character.gridY * blocksPerRow + pacMan.gridX - blocksPerRow;
                return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
                break;
            case 'down':
                gameGridIndex = character.gridY * blocksPerRow + pacMan.gridX + blocksPerRow;
                return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
                break;
            case 'right':
                gameGridIndex = character.gridY * blocksPerRow + character.gridX + 1;
                return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
                break;
            case 'left':
                gameGridIndex = character.gridY * blocksPerRow + character.gridX - 1;
                return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
                break;
            default:
                return false;
        }

    }


    function keyEventListener(event) {
        var x = event.keyCode;
        console.log("keyCode:",x);
        if (x == 83) {  // 83 is the 's' key

            document.getElementById("song1").play();
        }
    }
    document.body.addEventListener("keyup", keyEventListener, false);
    window.addEventListener('keydown',checkKey,true);
    renderContent();
});
