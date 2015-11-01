/**
 * Created by bzweifel on 9/22/15.
 */

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

var ghostScared = new Image();
ghostScared.src = "images/sprites/ghost-run-right.png";

var character = function(){
    this.myName             = 'pacMan';
    this.gridX              = 15;
    this.gridY              = 24;
    this.coordX             = this.gridX * gridBlockSize;
    this.coordY             = this.gridY * gridBlockSize + gridBlockSize/2;
    // characters velocity is displacement/milliseconds ( 5px per 100 milliseconds) milliseconds is gameSpeed
    this.displacement       = 5;       // in pixels needs to be a factor of gridBlockSize 
    this.curDirection       = "right";
    this.desDirection       = "right";
    this.myContext          = "";
    this.mode               = 'chase'; // modes for ghosts: chase, scatter, consumed
    this.isActive           = true;
    this.targetX            = 0;
    this.targetY            = 0;
    this.myImage            = "";
    this.scaredImage        = ghostScared;
    this.readyToRelease     = false;
    this.centerOfCage       = false;
    this.countMode         = 0;
};

var gameOver = false;
var livesLeft = 2;
var playersCollided = false;

// Set or change defaults for characters
var pacMan = new character();
var blinky = new character();
var inky = new character();
var clyde = new character();
var pinky = new character();
var ghosts = [blinky, inky, clyde, pinky];

$(document).ready(function(){
    //console.log("JQuery is Ready")
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

    var gameStarted = false;
    
    var gameSpeed = 100;
    var tempPause = false;
    var timeToChase = 30000; // 30 seconds
    var timeToScatter = 10000; // 10 seconds

    // (302,250) starting location of Active ghost
    // (302,300) middle of ghost cage
    var ghostCageCenterX = 302;
    var ghostCageCenterY = 300;
    
    var ghostStartingX = 302;
    var ghostStartingY = 250;
    
    function renderContent(){
        context.save();
        setDefaults();
        pacImg.onload = function(){
           drawCharacter(pacMan);
        }; 
        ghost1.onload = function(){
            drawCharacter(blinky);
        };
        ghost2.onload = function(){
            drawCharacter(inky);
        };
        ghost3.onload = function(){
            drawCharacter(clyde);
        };
        ghost4.onload = function(){
            drawCharacter(pinky);   
        };
        context.restore();
    }
        
    function setDefaults(){
        pacMan.myImage = pacImg;
        pacMan.myContext = pacManContext;
        pacMan.gridX              = 15;
        pacMan.gridY              = 24;
        pacMan.coordX             = pacMan.gridX * gridBlockSize;
        pacMan.coordY             = pacMan.gridY * gridBlockSize + gridBlockSize/2;
        pacMan.curDirection       = "right";
        pacMan.desDirection       = "right";

        blinky.myContext = ghost1Context;
        blinky.coordX = 302;
        blinky.gridX =  blinky.coordX / gridBlockSize;
        blinky.coordY = 250;
        blinky.gridY = (blinky.coordY - gridBlockSize/2) / gridBlockSize;
        blinky.targetX = blocksPerRow *  gridBlockSize;
        blinky.targetY = 0;
        blinky.myName = 'blinky';
        blinky.displacement = 4;
        blinky.myImage = ghost1;
        blinky.curDirection = "right";

        inky.myContext = ghost2Context;
        inky.coordX = 302;
        inky.gridX =  inky.coordX / gridBlockSize;
        inky.coordY = 300;
        inky.gridY = (inky.coordY - gridBlockSize/2) / gridBlockSize;
        inky.isActive = false;
        inky.targetX = blocksPerRow *  gridBlockSize;
        inky.targetY = blocksPerRow *  gridBlockSize;
        inky.myName = 'inky';
        inky.myImage = ghost2;
        inky.displacement = 4;
        inky.curDirection = "right";

        clyde.myContext = ghost3Context;
        clyde.coordX = 334;
        clyde.gridX =  clyde.coordX / gridBlockSize;
        clyde.coordY = 300;
        clyde.gridY = (clyde.coordY - gridBlockSize/2) / gridBlockSize;
        clyde.isActive = false;
        clyde.targetX = 0;
        clyde.targetY = blocksPerRow *  gridBlockSize;
        clyde.myName = 'clyde';
        clyde.myImage = ghost3;
        clyde.displacement = 4;
        clyde.curDirection = 'right';

        pinky.myContext = ghost4Context;
        pinky.coordX = 266;
        pinky.gridX =  pinky.coordX / gridBlockSize;
        pinky.coordY = 300;
        pinky.gridY = (pinky.coordY - gridBlockSize/2) / gridBlockSize;
        pinky.isActive = false;
        pinky.targetX = 0;
        pinky.targetY = 0;
        pinky.myName = 'pinky';
        pinky.myImage = ghost4;
        pinky.displacement = 4;
        pinky.readyToRelease = true;
        pinky.curDirection = 'left';
    }
    
    /*
     Blinky - Red - ghost 1
     Inky - blue - ghost 2
     Clyde - orange - ghost 3
     Pinky - pink - ghost 4
    
     AI is going to set to mimic ghosts found here: http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
     with each ghost moving toward a target tile using the minimum straight line distance between options of moves.
    
     Blinky (Red) 
         target tile = pacman current tile
         Starts outside the gate house
         scatter tile = top right corner outside of map
         
     Pinky (pink) 
         target tile = 4 tiles ahead of pacman current direction
         release immediately at start of level
         scatter tile = top left corner outside of map
         
     Inky (blue)
         target tile { tile = 2 in front of pacman 
                      xAwayFromBlinky = num of x tiles away from tile and blinky
                      yAwayFromBlinky = num of y tiles away from tile and blinky
                      target tile = (tile.x + xAwayFromBlinky, tile.y + yAwayFromBlinky)
                      }
         release after 30 pac dots have been consumed
         scatter tile = bottom right corner outside of map
         
     Clyde (orange)
         target tile { if greater than 8 tiles away from pacMan
                          target tile = pacMan (same AI as Blinky)
                      else
                          target tile = tile outside of map in bottom left corner
         release after 1/3 of pac dots have been consumed and not during the first level
         scatter tile = bottom left corner outside of map
     */
        
    function moveGhosts(){
        for(var i = 0; i < ghosts.length; i++){
            var ghost = ghosts[i];
            if(ghost.isActive){
                // chase; scatter; scared; consumed
                if(ghost.mode != 'consumed'){
                    // Is ghost at cross roads? (more than one option to move)
                    setTargetGrid(ghost);
                    
                    if((isAtCrossRoads(ghost) && isCharacterInCenter(ghost)) || (!canCharacterMoveInDirection(ghost, ghost.curDirection) && isCharacterInCenter(ghost))){
                        var ghostOptions = getOptions(ghost);

                        var minLength = -1;
                        var dir = ghost.curDirection;
                        for(var j = 0; j < ghostOptions.length; j++){

                            var a = getXTileFromCharAndDir(ghost,ghostOptions[j]) - ghost.targetX;
                            a = Math.pow(a,2);
                            
                            var b = getYTileFromCharAndDir(ghost,ghostOptions[j]) - ghost.targetY;
                            b = Math.pow(b,2);
                            
                            var c = a + b;
                            c = Math.sqrt(c);

                            if(c < minLength || minLength == -1){
                                minLength = c;
                                dir = ghostOptions[j];
                            }
                        }
                        ghost.curDirection = dir;
                        moveCharInCurrentDirection(ghost);
                    }
                    else{
                        if(canCharacterMoveInDirection(ghost,ghost.curDirection) || !isCharacterInCenter(ghost)){
                            moveCharInCurrentDirection(ghost);
                        }
                        else{
                            console.log("cannot move!!")
                        }
                    }
                }
            }
            else if(ghost.readyToRelease){
                if(!ghost.centerOfCage){
                    moveGhostToCenterOfCage(ghost);
                }
                else{
                    moveGhostToFieldFromCage(ghost);
                }
            }
        }
    }
    
    function moveGhostToCenterOfCage(char){
        if(Math.abs(char.coordX - ghostCageCenterX) <= char.displacement && (char.coordX != ghostCageCenterX)){
            moveCharacterHorizontal(ghostCageCenterX,char);
        }
        else if(char.coordX != ghostCageCenterX){
            if(char.coordX < ghostCageCenterX){ 
                // Move to the right towards the center
                moveCharacterRight(char);
            }
            else{
                moveCharacterLeft(char);
            }
        }
        else if(Math.abs(char.coordY - ghostCageCenterY) <= char.displacement && (char.coordY != ghostCageCenterY)){
            moveCharacterVertical(ghostCageCenterY,char);
        }
        else if( char.coordY != ghostCageCenterY){
            if(char.coordY > ghostCageCenterY){
                moveCharacterUp(char);
            }
            else{
                moveCharacterDown(char);
            }
        }
        
        if(char.coordX == ghostCageCenterX && char.coordY == ghostCageCenterY){
            char.centerOfCage = true;
        }
    }
    
    function moveGhostToFieldFromCage(char){
        if(Math.abs(char.coordX - ghostStartingX) <= char.displacement && (char.coordX != ghostStartingX)){
            moveCharacterHorizontal(ghostStartingX,char);
        }
        else if(char.coordX != ghostStartingX){
            if(char.coordX < ghostStartingX){
                // Move to the right towards the center
                moveCharacterRight(char);
            }
            else{
                moveCharacterLeft(char);
            }
        }
        else if(Math.abs(char.coordY - ghostStartingY) <= char.displacement && (char.coordY != ghostStartingY)){
            moveCharacterVertical(ghostStartingY,char);
        }
        else if( char.coordY != ghostStartingY){
            if(char.coordY > ghostStartingY){
                moveCharacterUp(char);
            }
            else{
                moveCharacterDown(char);
            }
        }

        if(char.coordX == ghostStartingX && char.coordY == ghostStartingY){
            char.isActive = true;
            char.readyToRelease = false;
            char.centerOfCage = false;
        }
    }

    function setTargetGrid(ghost){
        switch(ghost.myName){
            case 'blinky':
                if(ghost.mode == 'chase'){
                    ghost.targetX = pacMan.gridX;
                    ghost.targetY = pacMan.gridY;
                    ghost.countMode++;
                }
                else if(ghost.mode == 'scatter' || ghost.mode == 'scared'){
                    // Top Right Corner
                    ghost.targetX = blocksPerRow * gridBlockSize;
                    ghost.targetY = 0;
                    ghost.countMode++;
                }
                else if(ghost.mode == 'consumed'){
                }
                break;
            case 'pinky':
                if(ghost.mode == 'chase'){
                    switch(pacMan.curDirection){
                        case UP:
                            ghost.targetX = pacMan.gridX;
                            ghost.targetY = pacMan.gridY - 4;
                            break;
                        case DOWN:
                            ghost.targetX = pacMan.gridX;
                            ghost.targetY = pacMan.gridY + 4;
                            break;
                        case LEFT:
                            ghost.targetX = pacMan.gridX - 4;
                            ghost.targetY = pacMan.gridY;
                            break;
                        case RIGHT:
                            ghost.targetX = pacMan.gridX + 4;
                            ghost.targetY = pacMan.gridY;
                            break;
                    }
                    ghost.countMode++;
                }
                else if(ghost.mode == 'scatter'|| ghost.mode == 'scared'){
                    // Top Left Corner
                    ghost.targetX = 0;
                    ghost.targetY = 0;
                    ghost.countMode++;

                }
                else if(ghost.mode == 'consumed'){
                }
                break;
            case 'clyde':
                if(ghost.mode == 'chase'){
                    var distanceAway = Math.abs(ghost.gridX - pacMan.gridX) + Math.abs(ghost.gridY - pacMan.gridY);
                    if(distanceAway > 8){
                        ghost.targetX = pacMan.gridX;
                        ghost.targetY = pacMan.gridY;
                    }
                    else{
                        // Bottom Left Corner
                        ghost.targetX = 0;
                        ghost.targetY = blocksPerRow * gridBlockSize;
                    }
                    ghost.countMode++;
                }
                else if(ghost.mode == 'scatter' || ghost.mode == 'scared'){
                    // Bottom Left Corner
                    ghost.targetX = 0;
                    ghost.targetY = blocksPerRow * gridBlockSize;
                    ghost.countMode++;

                }
                else if(ghost.mode == 'consumed'){
                    ghost.countMode = 0;
                }
                break;
            case 'inky':
                if(ghost.mode == 'chase'){
                    var tempTargetX = 0;
                    var tempTargetY = 0;
                    switch(pacMan.curDirection){
                        case UP:
                            tempTargetX = pacMan.gridX;
                            tempTargetY = pacMan.gridY - 2;
                            break;
                        case DOWN:
                            tempTargetX = pacMan.gridX;
                            tempTargetY = pacMan.gridY + 2;
                            break;
                        case LEFT:
                            tempTargetX = pacMan.gridX - 2;
                            tempTargetY = pacMan.gridY;
                            break;
                        case RIGHT:
                            tempTargetX = pacMan.gridX + 2;
                            tempTargetY = pacMan.gridY;
                            break;
                    }
                    var xAwayFromBlinky = tempTargetX - blinky.gridX;
                    var yAwayFromBlinky = tempTargetY - blinky.gridY;
                    
                    ghost.targetX = tempTargetX + xAwayFromBlinky;
                    ghost.targetY = tempTargetY + yAwayFromBlinky;
                    ghost.countMode++;
                }
                else if(ghost.mode == 'scatter' || ghost.mode == 'scared'){
                    // Bottom Right Corner
                    ghost.targetX = blocksPerRow * gridBlockSize;
                    ghost.targetY = blocksPerRow * gridBlockSize;
                    ghost.countMode++;

                }
                else if(ghost.mode == 'consumed'){

                }
                break;
        }
        
        // Chase mode for 20 seconds then scatter for 7 seconds and repeat
        if(ghost.countMode > Math.floor(timeToChase/gameSpeed) && ghost.mode == 'chase'){
            ghost.mode = 'scatter';
            ghost.countMode = 0;
            reverseDirection(ghost);
        }
        
        if(ghost.countMode > Math.floor(timeToScatter/gameSpeed) && ghost.mode == 'scatter'){
            ghost.mode = 'chase';
            ghost.countMode = 0;
            reverseDirection(ghost);
        }
    }
    
    function isAtCrossRoads(char){
        var numOfOptions = 0;
        
        if(canCharacterMoveInDirection(char,UP) && char.curDirection != DOWN){
            numOfOptions++;
            //console.log("Can move up");
        }

        if(canCharacterMoveInDirection(char,DOWN) && char.curDirection != UP){
            numOfOptions++;
            //console.log("Can move down");
        }

        if(canCharacterMoveInDirection(char,LEFT) && char.curDirection != RIGHT){
            numOfOptions++;
            //console.log("Can move left");
        }

        if(canCharacterMoveInDirection(char,RIGHT) && char.curDirection != LEFT){
            numOfOptions++;
            //console.log("Can move right");
        }
        
        if(numOfOptions > 1){
            return true;
        }
        
        return false;
    }
    
    function getOptions(char){
        var charOptions = [];

        if(canCharacterMoveInDirection(char,UP) && char.curDirection != DOWN){
            charOptions.push(UP);
        }

        if(canCharacterMoveInDirection(char,DOWN) && char.curDirection != UP){
            charOptions.push(DOWN);
        }

        if(canCharacterMoveInDirection(char,LEFT) && char.curDirection != RIGHT){
            charOptions.push(LEFT);
        }

        if(canCharacterMoveInDirection(char,RIGHT) && char.curDirection != LEFT){
            charOptions.push(RIGHT);
        }
        
        return charOptions;
    }
    
    function getXTileFromCharAndDir(char, dir){
        var x;
        switch (dir){
            case UP:
            case DOWN:
                x = char.gridX;
                break;
            case LEFT:
                x = char.gridX - 1;
                break;
            case RIGHT:
                x = char.gridX + 1;
                break;
        }
        return x;
    }

    function getYTileFromCharAndDir(char, dir){
        var y;
        switch (dir){
            case UP:
                y = char.gridY - 1;
                break;
            case DOWN:
                y = char.gridY + 1;
                break;
            case LEFT:
            case RIGHT:
                y = char.gridY;
                break;
        }
        return y;
    }

    // User moves Pac Man
    function checkKey(e){
        e = e || window.event;
        tempPause=false;
        playersCollided = false;
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
        if(!gameStarted){
            document.getElementById('readyPlayer').style.display = 'none';
            pacMan.isMoving = true;
            gameStarted = true;
            runGame();
        }

        if(!pacMan.isMoving){
            pacMan.isMoving = true;
        }
        //runGame();
    }
    
    function movePacMan(){
        if(isCharacterInCenter(pacMan)){
            if(canCharacterMoveInDirection(pacMan, pacMan.desDirection)){
                pacMan.curDirection = pacMan.desDirection;
                moveCharInCurrentDirection(pacMan);
            }
            else{
                if(canCharacterMoveInDirection(pacMan, pacMan.curDirection)){
                    //pacMan.desDirection = pacMan.curDirection;
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
    }
    
    
    function backToStartingPosition(){
        pacMan.myContext.clearRect(0, 0, canvas.width, canvas.height);

        for(var i = 0; i < ghosts.length ; i++) {
            ghosts[i].myContext.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        setDefaults();
        
        drawCharacter(pacMan);
        drawCharacter(blinky);
        drawCharacter(inky);
        drawCharacter(clyde);
        drawCharacter(pinky);
    }
    
    function playerCollision(){
        for(var i = 0; i < ghosts.length && !playersCollided; i++){
            if(ghosts[i].gridX == pacMan.gridX && ghosts[i] && ghosts[i].gridY == pacMan.gridY && ghosts[i].mode != 'scared'){
                livesLeft--;
                playersCollided = true;
                if(livesLeft < 0){
                    gameOver = true;
                    document.getElementById("gameOver").style.display = '';
                }
                else{
                    // return characters back to starting positions
                    backToStartingPosition();
                    pacMan.isMoving = false;
                    gameStarted = false;
                    // Remove life image
                    if(livesLeft==1){
                        document.getElementById("life2").style.display = 'none';
                    }
                    else if(livesLeft ==0 ){
                        document.getElementById("life1").style.display = 'none';
                    }
                }
            }
        }
        
    }
    
    function runGame(){
        if(!tempPause && !gameOver){
            
            // Move PacMan First
            if(pacMan.isMoving){
                movePacMan();
            }
            
            // Then move ghosts
            moveGhosts();
            
            // Check for collisions
            playerCollision();

            if(!playersCollided){
                setTimeout(function(){
                    runGame();
                }, gameSpeed);
            }
        }
    }
    
    //document.body.addEventListener("keyup", keyEventListener, false);
    window.addEventListener('keydown',checkKey,true);
    renderContent();
});
