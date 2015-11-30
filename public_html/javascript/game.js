/**
 * Created by bzweifel on 9/22/15.
 */
    
var GAMESPEED = 240;

var gameOver = false;
var livesLeft = 2;
var playersCollided = false;
var numOfGhostsAte = 0;
var gameStarted = false;
var playersReady = false;
var numOfPlayers = 0;
var highScore = '';

// Initialize players
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

var ghosts = [blinky, inky, clyde, pinky];

var player1 = {
    gameGrid:       startingGameGridArray.slice(),
    score:          score.valueOf(),
    lives:          livesLeft.valueOf(),
    dotsConsumed:   dotsConsumed.valueOf(),
    active:         true,
    gameOver:       gameOver
};

var player2 = {
    gameGrid:       startingGameGridArray.slice(),
    score:          score.valueOf(),
    lives:          livesLeft.valueOf(),
    dotsConsumed:   dotsConsumed.valueOf(),
    active:         false,
    gameOver:       gameOver
};

$(document).ready(function () {
    setTimeout(function () {
        $("#credits").html("Credits: 1")
    }, 200);

    var tempPause = false;
    var timeToChase = 30000; 
    var timeToScatter = 10000;

    function renderContent() {
        context.save();
        setDefaults();
        loadHighScore();
        context.restore();
    }
    
    /*
        START GHOSTS
     */

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
    // Main ghosts movement function
    function moveGhosts() {
        // Loop through each ghost and move them
        for (var i = 0; i < ghosts.length; i++) {
            var ghost = ghosts[i];
         
            // Move ghost if it is on playing field
            if (ghost.isActive && ghost.mode != CONSUMED) {
                ghost.isMoving = true;
                // chase; scatter; scared; consumed
                ghostDecisionToMove(ghost);
            }
            else if (ghost.mode == CONSUMED){
                //Is ghost ready to go back in cage
                if(Math.abs(ghost.coordX - ghostStartingX) < gridBlockSize/4 && Math.abs(ghost.coordY - ghostStartingY) < gridBlockSize/4 || ghost.resetting && !ghost.centerOfCage){
                    // Move ghost back in cage
                    ghost.displacement = 1;
                    ghost.resetting = true;
                    moveGhostToCenterOfCage(ghost);
                }
                // Is ghost ready to be reset
                else if(ghost.centerOfCage){
                    ghost.mode = CHASE;
                    ghost.isActive = false;
                    ghost.readyToRelease = true;
                    ghost.resetting = false;
                }
                // Move ghost to starting position
                else{
                    ghostDecisionToMove(ghost);
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
    
    // Move ghosts in a direction
    function ghostDecisionToMove(ghost){
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

    // Main Ghost AI function (based on movement towards a target grid location)
    function setTargetGrid(ghost) {
        // Each ghost moves towards a target location based on game logic, set that location per ghost
        switch (ghost.myName) {
            case 'blinky':
                //Blinky always attempts to move to pacMans current location in chase mode.
                if (ghost.mode == CHASE) {
                    ghost.targetX = pacMan.gridX;
                    ghost.targetY = pacMan.gridY;
                }
                else if (ghost.mode === SCATTER || ghost.mode === SCARED || ghost.mode === BLINKING) {
                    // Top Right Corner
                    ghost.targetX = blocksPerRow;
                    ghost.targetY = 0;
                }
                else if (ghost.mode == CONSUMED) {
                    isConsumed(ghost);
                }
                break;
            case 'pinky':
                //Pinky always attemts to intercept pacman ahead of his current location in chase mode.
                if (ghost.mode === CHASE) {
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
                }
                else if (ghost.mode === SCATTER || ghost.mode === SCARED || ghost.mode === BLINKING) {
                    // Top Left Corner
                    ghost.targetX = 0;
                    ghost.targetY = 0;
                }
                else if (ghost.mode === CONSUMED) {
                    isConsumed(ghost);                    
                }
                break;
            case 'clyde':
                if (ghost.mode === CHASE) {
                    var distanceAway = Math.abs(ghost.gridX - pacMan.gridX) + Math.abs(ghost.gridY - pacMan.gridY);
                    if (distanceAway > 8) {
                        ghost.targetX = pacMan.gridX;
                        ghost.targetY = pacMan.gridY;
                    }
                    else {
                        // Bottom Left Corner
                        ghost.targetX = 0;
                        ghost.targetY = blocksPerRow ;
                    }
                }
                else if (ghost.mode === SCATTER || ghost.mode === SCARED || ghost.mode === BLINKING) {
                    // Bottom Left Corner
                    ghost.targetX = 0;
                    ghost.targetY = blocksPerRow;
                }
                else if (ghost.mode === CONSUMED) {
                    isConsumed(ghost);
                }
                break;
            case 'inky':
                //inky always attempts to ambush pacman from behind his current location in chase mode.
                if (ghost.mode === CHASE) {
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
                }
                else if (ghost.mode === SCATTER || ghost.mode === SCARED || ghost.mode === BLINKING) {
                    // Bottom Right Corner
                    ghost.targetX = blocksPerRow;
                    ghost.targetY = blocksPerRow;
                }
                else if (ghost.mode === CONSUMED) {
                    isConsumed(ghost);
                }
                break;
        }
        
    }
    
    // Switch between Chase and Scatter 
    function ghostModeSwitch() {
        if(gameStarted){
            var milSecToWait = timeToChase;
            for (var i = 0; i < ghosts.length; i++) {
                ghost = ghosts[i];
                if (ghost.mode === SCATTER) {
                    ghost.mode = CHASE;
                    milSecToWait = timeToChase;
                }
                else if (ghost.mode === CHASE) {
                    ghost.mode = SCATTER;
                    milSecToWait = timeToScatter;
                }
            }
            setTimeout(function(){ghostModeSwitch();}, milSecToWait);
        }
    }
    
    // AI for all ghosts are the same when they are consumed
    function isConsumed(char){
        // set target location of tile right above ghost gate
        char.targetX = ghostStartingX / gridBlockSize;
        char.targetY = ghostStartingY / gridBlockSize;
    }

    // Returns the directions a character can move to from their current spot
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
    
    /*
     END GHOSTS
     */
    
    /*
     START PAC-MAN
     */
    // User moves Pac Man with key board
    function checkKey(e) {
        e = e || window.event;
        if(tempPause){
            tempPause = false;
            document.getElementById('paused').style.display = 'none';
        }

        switch (e.keyCode) {
            case 38:	// UP Arrow Key pressed
            case 87:	// W pressed
                pacMan.desDirection = "up";
                e.preventDefault();
                break;
            case 40:	// DOWN Arrow Key pressed
            case 83:	// S pressed 
                pacMan.desDirection = "down";
                e.preventDefault();
                break;
            case 37:	// LEFT Arrow Key pressed
            case 65:	// A pressed
                pacMan.desDirection = "left";
                e.preventDefault();
                break;
            case 39:	// RIGHT Arrow Key pressed
            case 68:	// D pressed
                pacMan.desDirection = "right";
                e.preventDefault();
                break;
            case 80:    // P pressed
                tempPause = !tempPause;
                document.getElementById('paused').style.display = '';
                break;
            default:
                break;
        }
        userInput();
    }
    
    
    function userInput(){
        playersCollided = false;

        if (!gameStarted && playersReady) {
            document.getElementById('readyPlayer').style.display = 'none';
            document.getElementById('readyPlayer2').style.display = 'none';
            document.getElementById('gameWon').style.display = 'none';
            pacMan.isMoving = true;
            sound_pacman_background1.play();
            gameStarted = true;
            ghostModeSwitch();
        }

        if (!pacMan.isMoving) {
            pacMan.isMoving = true;
        }
    }

    // Mobile functions
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
    /*
     END PAC-MAN
     */

    function runGame() {
        // Check if game is over or paused
        if (!tempPause && !gameOver && gameStarted) {
            
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
            
            // Check for collisions
            playerCollision();

            // Then move ghosts
            moveGhosts();

            // Check for portal move for ghosts
            for(var j = 0; j < ghosts.length; j++){
                portalMove(ghosts[j]);
            }

            // Check for collisions
            playerCollision();
        }
        else if(gameOver){
            if(player1.active && player2.lives >= 0 && player2.dotsConsumed != maxDots){
                switchPlayers();
            }
            else if(player2.active && player1.lives >= 0 && player1.dotsConsumed != maxDots){
                switchPlayers();
            }
        }
        else {
            sound_pacman_background1.stop();
        }
    }

    (function animloop() {
        setTimeout(function () {
            requestAnimFrame(animloop);
            if (!playersCollided && gameStarted) {
                runGame()
            }
        }, 1000 / GAMESPEED);

    })();

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

function setHighScore(){
    if(score > highScore){
        document.cookie = 'high-score' + '=' + score + ";";
        document.getElementById("highScore").innerHTML = "" + score;
        highScore = score;
    }
    
    if(player1.score > highScore && player1.score > player2.score){
        document.cookie = 'high-score' + '=' + player1.score + ";";
        document.getElementById("highScore").innerHTML = "" + player1.score;
    }
    else if(player2.score > highScore ){
        document.cookie = 'high-score' + '=' + player2.score + ";";
        document.getElementById("highScore").innerHTML = "" + player2.score;
    }
     
}

function restart(){
    gameGridArray = startingGameGridArray.slice();
    player1.active = true;
    player2.active = false;
    
    setHighScore();
    
    player1.score = 0;       
    player1.lives = 2;          
    player1.dotsConsumed = 0;
    player1.gameOver = false;
    
    player2.score = 0;
    player2.lives = 2;
    player2.dotsConsumed = 0;
    player2.gameOver = false;

    backToStartingPosition();
    gameOver = false;
    gameStarted = false;
    livesLeft = 2;
    dotsRemaining = 0;
    dotsConsumed = 0;
    score = 0;
    renderBoard();
    document.getElementById("life2").style.display = '';
    document.getElementById("life1").style.display = '';
    document.getElementById("score1").innerHTML = "" + 0;
    document.getElementById("score2").innerHTML = "" + 0;
    document.getElementById("readyPlayers").style.display = '';
    document.getElementById("readyPlayer").style.display = 'none';
    document.getElementById("readyPlayer2").style.display = 'none';
    document.getElementById("gameWon").style.display = 'none';
    document.getElementById("gameOver").style.display = 'none';
    document.getElementById("canvas-content").style.opacity = .5;
    numOfPlayers = 0;
    playersReady = false;
}

function readyOnePlayerGame(){

    restart();
    playersReady = true;
    player2.gameOver = true;
    player2.lives = -1;
    numOfPlayers = 1;
    document.getElementById("readyPlayer").style.display = '';
    document.getElementById("readyPlayers").style.display = 'none';
    document.getElementById("canvas-content").style.opacity = 1;

}
function readyTwoPlayerGame(){

    restart();
    playersReady = true;
    numOfPlayers = 2;   
    document.getElementById("readyPlayer").style.display = '';
    document.getElementById("readyPlayers").style.display = 'none';
    document.getElementById("canvas-content").style.opacity = 1;
}
function loadHighScore(){
    var cname = 'high-score=';
    var ca = document.cookie.split(';');
    var cfound = false;
    for(var i = 0; i <ca.length;i++){
        var c = ca[i];
        while(c.charAt(0)==' ') c = c.substring(1);
        if(c.indexOf(cname) == 0){
            highScore = c.substring(cname.length, c.length);
            cfound = true;
        }
    }
    if(cfound){
        document.getElementById("highScore").innerHTML = "" + highScore;
    }
    else{
        highScore = 0;
        document.getElementById("highScore").innerHTML = "" + 0;
    }
}
