/**
 * Created by bzweifel on 9/22/15.
 */
    
var GAMESPEED = 45;

var gameOver = false;
var livesLeft = 2;
var playersCollided = false;

// Set or change defaults for characters
var pacMan = new pacman({
    canvas: document.getElementById("pacMan"),
    myName: 'pacMan',
    src: "images/sprites/pacman-sprites.png",
    animationPlaying: false,
    ticksPerFrame: 0,
    startingFrame: 2,
    isActive: false
});

var blinky = new ghost({
    canvas: document.getElementById("ghost1"),
    myName: 'blinky',
    src: "images/sprites/pacman-sprites.png",
    animationPlaying: true,
    ticksPerFrame: 30,
    isActive:true
});
var inky = new ghost({
    canvas: document.getElementById("ghost2"),
    myName: 'inky',
    src: "images/sprites/pacman-sprites.png",
    animationPlaying: false,
    ticksPerFrame: 30,
    isActive:false
});
var clyde = new ghost({
    canvas: document.getElementById("ghost3"),
    myName: 'clyde',
    src: "images/sprites/pacman-sprites.png",
    animationPlaying: false,
    ticksPerFrame: 30,
    isActive: false
});
var pinky = new ghost({
    canvas: document.getElementById("ghost4"),
    myName: 'pinky',
    src: "images/sprites/pacman-sprites.png",
    animationPlaying: false,
    ticksPerFrame: 30,
    isActive: false
});

//var blinky = new character();
//var inky = new character();
//var clyde = new character();
//var pinky = new character();
var ghosts = [blinky, inky, clyde, pinky];

$(document).ready(function () {
    //console.log("JQuery is Ready")
    setTimeout(function () {
        $("#credits").html("Credits: 1")
    }, 200);

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

    function renderContent() {
        context.save();
        setDefaults();
        context.restore();
    }

    function setDefaults() {
        //  pacMan.myImage = pacImg;
        //  pacMan.myContext = pacManContext;
        
        pacMan.sprite.animationDef = pacMan.animationLoopRIGHT;
           
        pacMan.gridX = 15;
        pacMan.gridY = 24;
        pacMan.coordX = pacMan.gridX * gridBlockSize;
        pacMan.coordY = pacMan.gridY * gridBlockSize + gridBlockSize / 2;
        pacMan.curDirection = "right";
        pacMan.desDirection = "right";
        pacMan.isActive = false;
        
       // pacMan.sprite.animationPlaying = false;
        pacMan.sprite.startingFrame = 2;
       // pacMan.sprite.firstLoad();
        pacMan.sprite.loaded = false;

        //blinky.myContext = ghost1Context;
        blinky.mode = 'chase';
        blinky.coordX = 302;
        blinky.gridX = blinky.coordX / gridBlockSize;
        blinky.coordY = 250;
        blinky.gridY = (blinky.coordY - gridBlockSize / 2) / gridBlockSize;
        blinky.targetX = blocksPerRow * gridBlockSize;
        blinky.targetY = 0;
        blinky.displacement = 2;
        blinky.curDirection = "right";
        blinky.isActive = true;
        blinky.isMoving = true;
        blinky.sprite.loaded = false;
        blinky.readyToRelease = true;
        //blinky.sprite.animationPlaying = false;
        blinky.sprite.animationDef = blinky.animationLoopRIGHT;

        //inky.myContext = ghost2Context;
        inky.mode = 'chase';
        inky.coordX = 266;
        inky.gridX = inky.coordX / gridBlockSize;
        inky.coordY = 300;
        inky.gridY = (inky.coordY - gridBlockSize / 2) / gridBlockSize;
        inky.isActive = false;
        inky.targetX = blocksPerRow * gridBlockSize;
        inky.targetY = blocksPerRow * gridBlockSize;
        inky.displacement = 2;
        inky.curDirection = "right";
        inky.isActive = false;
        inky.sprite.loaded = false;
        inky.readyToRelease = false;
        inky.isMoving = false;
       // inky.sprite.animationPlaying = false;
        inky.sprite.animationDef = inky.animationLoopRIGHT;

        //  pinky.myContext = ghost4Context;
        pinky.mode = 'chase';
        pinky.coordX = 302;
        pinky.gridX = pinky.coordX / gridBlockSize;
        pinky.coordY = 300;
        pinky.gridY = (pinky.coordY - gridBlockSize / 2) / gridBlockSize;     
        pinky.targetX = 0;
        pinky.targetY = 0;  
        pinky.displacement = 2;
        pinky.readyToRelease = true;
        pinky.curDirection = 'left';
        pinky.isActive = false;
        pinky.sprite.loaded = false;
        pinky.isMoving = false;
       // pinky.sprite.animationPlaying = false;
        pinky.sprite.animationDef = pinky.animationLoopRIGHT;
        
        //  clyde.myContext = ghost3Context;
        clyde.mode = 'chase';
        clyde.coordX = 338;
        clyde.gridX = clyde.coordX / gridBlockSize;
        clyde.coordY = 300;
        clyde.gridY = (clyde.coordY - gridBlockSize / 2) / gridBlockSize;      
        clyde.targetX = 0;
        clyde.targetY = blocksPerRow * gridBlockSize;
        clyde.displacement = 2;
        clyde.curDirection = 'right';
        clyde.isActive = false;
        clyde.isMoving = false;
        clyde.sprite.loaded = false;
        clyde.sprite.animationPlaying = false;
        clyde.sprite.animationDef = clyde.animationLoopRIGHT;
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
    
    function moveGhosts() {
        // Loop through each ghost and move them
        for (var i = 0; i < ghosts.length; i++) {
            var ghost = ghosts[i];
         
            // Move ghost if it is on playing field
            if (ghost.isActive) {
                ghost.isMoving = true;
                // console.log("moveGhosts", ghost.myName)
                // chase; scatter; scared; consumed  (this can be blinking now??)
                
                // Is ghost at cross roads? (more than one option to move) && is in a position to move
                if ((isAtCrossRoads(ghost) && isCharacterInCenter(ghost)) || (!canCharacterMoveInDirection(ghost, ghost.curDirection) && isCharacterInCenter(ghost))) {
                    var ghostOptions = getOptions(ghost);
                    setTargetGrid(ghost);

                    var minLength = -1;
                    var dir = ghost.curDirection;
                    
                    // Find shortest straight line distance between options at the cross roads
                    for (var j = 0; j < ghostOptions.length; j++) {

                        var a = getXTileFromCharAndDir(ghost, ghostOptions[j]) - ghost.targetX;
                        a = Math.pow(a, 2);

                        var b = getYTileFromCharAndDir(ghost, ghostOptions[j]) - ghost.targetY;
                        b = Math.pow(b, 2);

                        var c = a + b;
                        c = Math.sqrt(c);

                        if (c < minLength || minLength == -1) {
                            minLength = c;
                            dir = ghostOptions[j];
                        }
                    }
                    ghost.curDirection = dir;
                    moveCharInCurrentDirection(ghost);
                }
                else {
                    // Keep moving in current direction if possible
                    if (canCharacterMoveInDirection(ghost, ghost.curDirection) || !isCharacterInCenter(ghost)) {
                        moveCharInCurrentDirection(ghost);
                    }
                    else {
                        console.log("cannot move!!")
                    }
                }
            }
            // Ghost is not on the playing field, are they ready to be release from the gate
            else if (ghost.readyToRelease) {
                ghost.isMoving = true;
                // Move the ghost to the center then to playing field
                if (!ghost.centerOfCage) {
                    moveGhostToCenterOfCage(ghost);
                }
                else {
                    moveGhostToFieldFromCage(ghost);
                }
            }
        }
    }

    function moveGhostToCenterOfCage(char) {
        // HORIZONTAL MOVE
        if (Math.abs(char.coordX - ghostCageCenterX) <= char.displacement && (char.coordX != ghostCageCenterX)) {
            // Ghost is close enough to the center, just move them there already!
            moveCharacterHorizontal(ghostCageCenterX, char);
        }
        else if (char.coordX != ghostCageCenterX) {
            // Move in the direction of the center of cage
            if (char.coordX < ghostCageCenterX) {
                moveCharacterRight(char);
            }
            else {
                moveCharacterLeft(char);
            }
        }
        
        // VERTICAL MOVE
        else if (Math.abs(char.coordY - ghostCageCenterY) <= char.displacement && (char.coordY != ghostCageCenterY)) {
            // Ghost is close enough to the center, just move them there already!
            moveCharacterVertical(ghostCageCenterY, char);
        }
        else if (char.coordY != ghostCageCenterY) {
            // Move in the direction of the center of cage
            if (char.coordY > ghostCageCenterY) {
                moveCharacterUp(char);
            }
            else {
                moveCharacterDown(char);
            }
        }

        // Is ghost in center of the cage and ready to move to the field
        if (char.coordX == ghostCageCenterX && char.coordY == ghostCageCenterY) {
            char.centerOfCage = true;
        }
    }

    function moveGhostToFieldFromCage(char) {
       
        // HORIZONTAL
        if (Math.abs(char.coordX - ghostStartingX) <= char.displacement && (char.coordX != ghostStartingX)) {
            // Ghost is close enough to the center, just move them there already!
            moveCharacterHorizontal(ghostStartingX, char);
        }
        else if (char.coordX != ghostStartingX) {
            // Move in the direction of the center of cage
            if (char.coordX < ghostStartingX) {
                moveCharacterRight(char);
            }
            else {
                moveCharacterLeft(char);
            }
        }
        
        // VERTICAL
        else if (Math.abs(char.coordY - ghostStartingY) <= char.displacement && (char.coordY != ghostStartingY)) {
            // Ghost is close enough to the center, just move them there already!
            moveCharacterVertical(ghostStartingY, char);
        }
        else if (char.coordY != ghostStartingY) {
            // Move in the direction of the center of cage
            if (char.coordY > ghostStartingY) {
                moveCharacterUp(char);
            }
            else {
                moveCharacterDown(char);
            }
        }

        // Ghost is ready, go get that evil pacMan!!
        if (char.coordX == ghostStartingX && char.coordY == ghostStartingY) {
            char.isActive = true;
            char.readyToRelease = false;
            char.centerOfCage = false;
        }
    }

    function setTargetGrid(ghost) {
        // Each ghost moves towards a target location based on game logic, set that location per ghost
        switch (ghost.myName) {
            case 'blinky':
                //Blinky always attempts to move to pacMans current location in chase mode.
                if (ghost.mode == 'chase') {
                    ghost.targetX = pacMan.gridX;
                    ghost.targetY = pacMan.gridY;
                    ghost.countMode++;
                }
                else if (ghost.mode == 'scatter' || ghost.mode == 'scared' || ghost.mode == 'blinking') {
                    // Top Right Corner
                    ghost.targetX = blocksPerRow * gridBlockSize;
                    ghost.targetY = 0;
                    ghost.countMode++;
                }
                else if (ghost.mode == 'consumed') {
                    // TO DO:
                    // set target location of tile right above ghost gate
                    // move really really fast there
                    // move into gate
                    // set back to chase
                }
                break;
            case 'pinky':
                //Pinky always attemts to intercept pacman ahead of his current location in chase mode.
                if (ghost.mode == 'chase') {
                    switch (pacMan.curDirection) {
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
                else if (ghost.mode == 'scatter' || ghost.mode == 'scared' || ghost.mode == 'blinking') {
                    // Top Left Corner
                    ghost.targetX = 0;
                    ghost.targetY = 0;
                    ghost.countMode++;

                }
                else if (ghost.mode == 'consumed') {
                    // TO DO:
                    // set target location of tile right above ghost gate
                    // move really really fast there
                    // move into gate
                    // set back to chase
                    
                }
                break;
            case 'clyde':
                if (ghost.mode == 'chase') {
                    var distanceAway = Math.abs(ghost.gridX - pacMan.gridX) + Math.abs(ghost.gridY - pacMan.gridY);
                    if (distanceAway > 8) {
                        ghost.targetX = pacMan.gridX;
                        ghost.targetY = pacMan.gridY;
                    }
                    else {
                        // Bottom Left Corner
                        ghost.targetX = 0;
                        ghost.targetY = blocksPerRow * gridBlockSize;
                    }
                    ghost.countMode++;
                }
                else if (ghost.mode == 'scatter' || ghost.mode == 'scared' || ghost.mode == 'blinking') {
                    // Bottom Left Corner
                    ghost.targetX = 0;
                    ghost.targetY = blocksPerRow * gridBlockSize;
                    ghost.countMode++;
                }
                else if (ghost.mode == 'consumed') {
                    // TO DO:
                    // set target location of tile right above ghost gate
                    // move really really fast there
                    // move into gate
                    // set back to chase
                }
                break;
            case 'inky':
                //inky always attempts to ambush pacman from behind his current location in chase mode.
                if (ghost.mode == 'chase') {
                    var tempTargetX = 0;
                    var tempTargetY = 0;
                    switch (pacMan.curDirection) {
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
                else if (ghost.mode == 'scatter' || ghost.mode == 'scared' || ghost.mode == 'blinking') {
                    // Bottom Right Corner
                    ghost.targetX = blocksPerRow * gridBlockSize;
                    ghost.targetY = blocksPerRow * gridBlockSize;
                    ghost.countMode++;
                }
                else if (ghost.mode == 'consumed') {
                    // TO DO:
                    // set target location of tile right above ghost gate
                    // move really really fast there
                    // move into gate
                    // set back to chase
                }
                break;
        }

        // Each move goes to ghost.countMode counter, currently using that
        // to calculate when to switch modes between chase and scatter
        
        // Chase mode for 20 seconds then scatter for 7 seconds and repeat
        if (ghost.countMode > Math.floor(timeToChase / gameSpeed) && ghost.mode == 'chase') {
            ghost.mode = 'scatter';
            ghost.countMode = 0;
            reverseDirection(ghost);
        }

        if (ghost.countMode > Math.floor(timeToScatter / gameSpeed) && ghost.mode == 'scatter') {
            ghost.mode = 'chase';
            ghost.countMode = 0;
            reverseDirection(ghost);
        }
    }

    // Used for Ghost AI
    function isAtCrossRoads(char) {
        var numOfOptions = 0;

        // Can the character move in different directions (Except backwards silly, can't move backwards!)
        if (canCharacterMoveInDirection(char, UP) && char.curDirection != DOWN) {
            numOfOptions++;
            //console.log("Can move up");
        }

        if (canCharacterMoveInDirection(char, DOWN) && char.curDirection != UP) {
            numOfOptions++;
            //console.log("Can move down");
        }

        if (canCharacterMoveInDirection(char, LEFT) && char.curDirection != RIGHT) {
            numOfOptions++;
            //console.log("Can move left");
        }

        if (canCharacterMoveInDirection(char, RIGHT) && char.curDirection != LEFT) {
            numOfOptions++;
            //console.log("Can move right");
        }

        if (numOfOptions > 1) {
            return true;
        }

        return false;
    }

    // Used for ghost AI
    function getOptions(char) {
        var charOptions = [];

        // Return an array of directions the character can move
        if (canCharacterMoveInDirection(char, UP) && char.curDirection != DOWN) {
            charOptions.push(UP);
        }

        if (canCharacterMoveInDirection(char, DOWN) && char.curDirection != UP) {
            charOptions.push(DOWN);
        }

        if (canCharacterMoveInDirection(char, LEFT) && char.curDirection != RIGHT) {
            charOptions.push(LEFT);
        }

        if (canCharacterMoveInDirection(char, RIGHT) && char.curDirection != LEFT) {
            charOptions.push(RIGHT);
        }

        return charOptions;
    }

    function getXTileFromCharAndDir(char, dir) {
        var x;
        // if they move in a direction what grid X will they be in?
        switch (dir) {
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

    function getYTileFromCharAndDir(char, dir) {
        var y;
        // if they move in a direction what grid Y will they be in?
        switch (dir) {
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

    // User moves Pac Man with key board
    function checkKey(e) {
        e = e || window.event;
        switch (e.keyCode) {
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
            default:
                break;
        }
        
        userInput();
    }
    
    function userInput(){
        playersCollided = false;

        if (!gameStarted) {
            document.getElementById('readyPlayer').style.display = 'none';
            pacMan.isMoving = true;
            gameStarted = true;
            sound_pacman_background1.play();
        }

        if (!pacMan.isMoving) {
            pacMan.isMoving = true;
        }
    }

    // User moves Pac Man with Swipe
    Hammer('.container').on("swiperight", function(event) {
            event.gesture.preventDefault();
            pacMan.desDirection = "right";
            userInput();
    });
    Hammer('.container').on("swipeleft", function(event) {
            event.gesture.preventDefault();
            pacMan.desDirection = "left";
            userInput();
    });
    Hammer('.container').on("swipeup", function(event) {
            event.gesture.preventDefault();
            pacMan.desDirection = "up";
            userInput();
    });
    Hammer('.container').on("swipedown", function(event) {
            event.gesture.preventDefault();
            pacMan.desDirection = "down";
            userInput();
    });
  
    (function animloop() {
        setTimeout(function () {
            requestAnimFrame(animloop);
            if (!playersCollided && gameStarted) {
                runGame()
            }
        }, 1000 / GAMESPEED);
        
    })();

    // Move Pac Man
    function movePacMan() {
        
        // Pac Man can only move when in center of current grid, those be the rules.. well our rules.
        if (isCharacterInCenter(pacMan)) {
            // Can Pac Man move in the direction they want?
            if (canCharacterMoveInDirection(pacMan, pacMan.desDirection)) {
                pacMan.curDirection = pacMan.desDirection;
                pacMan.sprite.animationPlaying = true;
                moveCharInCurrentDirection(pacMan);
            }
            else {
                // Can Pac Man keep moving in current direction
                if (canCharacterMoveInDirection(pacMan, pacMan.curDirection)) {
                    pacMan.sprite.animationPlaying = true;
                    moveCharInCurrentDirection(pacMan);
                }
                else {
                    // Stop PacMan
                    pacMan.isMoving = false;
                    pacMan.sprite.animationPlaying = false;
                }
            }
        }
        else {
            moveCharInCurrentDirection(pacMan);
        }
    }
    
    function backToStartingPosition() {
        console.log("backToStartingPosition");
        // Set the defaults
        setDefaults();
        
        // Clear the canvases 
        pacMan.context.clearRect(0, 0, pacMan.canvas.width, pacMan.canvas.height);

        for (var i = 0; i < ghosts.length ; i++) {
            ghosts[i].context.clearRect(0, 0, ghosts[i].canvas.width, ghosts[i].canvas.height);
            ghosts[i].mode = "chase";
        }
    }

    function portalMove(char){
        // Jump from one side of field to the other.. like magic!
        
        // Check if the character's position is greater than or less than grid 
        if( (char.gridX >= blocksPerRow -1 || char.gridX <= 0) && isCharacterInCenter(char) ){
            // change grid to opposite side (and coordinates, don't forget)
            if(char.gridX >= blocksPerRow -1){
                char.gridX = 0;
                char.coordX = char.gridX * gridBlockSize + gridBlockSize / 2;
            }
            else{
                char.gridX = blocksPerRow-1;
                char.coordX = char.gridX * gridBlockSize; + gridBlockSize / 2;
            }
        }
    }

    function playerCollision() {
        // Loop through ghosts and see if they have collided with Pac Man.... may he rest in peace, oh look a quarter!
        for (var i = 0; i < ghosts.length && !playersCollided; i++) {
            
            // Are they in the same grid coordinates
            if (ghosts[i].gridX == pacMan.gridX && ghosts[i] && ghosts[i].gridY == pacMan.gridY) {
                sound_pacman_background1.stop();
                console.log("PLAYERS COLLIDE:", ghosts[i].myName,ghosts[i].mode);

                // Can PacMan eat them??
                if (ghosts[i].mode == 'scared' || ghosts[i].mode == 'blinking') {
                    ghosts[i].mode = 'consumed';
                    console.log("PACMAN EATS ", ghosts[i].myName);
                    sound_pacman_getghost.play()
                }
                else if (ghosts[i].mode == 'consumed') {
                    // TO DO:
                    // set target location of tile right above ghost gate
                    // move really really fast there
                    // move into gate
                    // set back to chase
                }
                else {
                    //PACMAN DIES
                    sound_pacman_death.play();
                    livesLeft--;
                    playersCollided = true;
                    
                    // GAME OVER!!!!
                    if (livesLeft < 0) {
                        gameOver = true;
                        document.getElementById("gameOver").style.display = '';
                    }
                    else {
                        // Try Again User!
                        // return characters back to starting positions
                        backToStartingPosition();
                        pacMan.isMoving = false;
                        gameStarted = false;
                        // Remove life image
                        if (livesLeft == 1) {
                            document.getElementById("life2").style.display = 'none';
                        }
                        else if (livesLeft == 0) {
                            document.getElementById("life1").style.display = 'none';
                        }
                    }
                }
            }
        }
    }

    function runGame() {
        // Check if game is over or pauced
        if (!tempPause && !gameOver) {
            
            // Commenting out for now, I think this might be a problem when pacMan is stopped
            // pacMan.sprite.animationPlaying = true;
            
            for (var i = 0; i < ghosts.length ; i++) {
                if (ghosts[i].isMoving) {
                    ghosts[i].sprite.animationPlaying = true;
                }
            }

            // Move PacMan First
            if (pacMan.isMoving) {
                movePacMan();
                // Check for portal move for PacMan
                portalMove(pacMan);
            }

            // Then move ghosts
            moveGhosts();

            // Check for portal move for ghosts
            for(var i = 0; i < ghosts.length; i++){
                portalMove(ghosts[i]);
            }

            // Check for collisions
            playerCollision();
        }
        else {
            sound_pacman_background1.stop();
        }
    }

    //http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    var sound_pacman_song1 = new sound({
        url: "sounds/pacman_song1.mp3",
        callback: function () {
            this.play();
            //setTimeout(function () {
            //    pacman_song1.pause();
            //    setTimeout(function () {
            //        pacman_song1.play();
            //    }, 1000);
            //}, 3000)
        }
    });
    
    //document.body.addEventListener("keyup", keyEventListener, false);
    window.addEventListener('keydown', checkKey, true);
    renderContent();
});
