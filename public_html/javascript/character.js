/**
 * Created by bzweifel on 10/27/15.
 */
// Below are functions to be used by Ghosts and PacMan
var dotsConsumed = 0;
var score = 0;
var UP = 'up';
var DOWN = 'down';
var LEFT = 'left';
var RIGHT = 'right';
// Modes
var CHASE = 'chase';
var SCARED = 'scared';
var BLINKING = 'blinking';
var SCATTER = 'scatter';
var CONSUMED = 'consumed';

// (300,300) middle of ghost cage
var ghostCageCenterX = 300;
var ghostCageCenterY = 300;

// (300,250) starting location of Active ghost
var ghostStartingX = 300;
var ghostStartingY = 250;

function moveCharInCurrentDirection(char) {
   
    // Move Character in their current direction
    switch (char.curDirection){
        case UP:
            moveCharacterUp(char);
            break;
        case DOWN:
            moveCharacterDown(char);
            break;
        case RIGHT:
            moveCharacterRight(char);
            break;
        case LEFT:
            moveCharacterLeft(char);
            break;
        default:
            return false;
    }
}

// START HORIZONTAL MOVE
function moveCharacterRight(char) {
    var tempCoordX = char.coordX + char.displacement;
    moveCharacterHorizontal(tempCoordX, char);
}

function moveCharacterLeft(char){
    var tempCoordX = char.coordX - char.displacement;
    moveCharacterHorizontal(tempCoordX, char);
}

function moveCharacterHorizontal(x, char){
    var tempGridX = Math.floor(x / gridBlockSize);

    char.coordX = x;
    char.gridX = tempGridX;
    
    moveCharacter(char);
    
    char.context.clearRect(0, 0, char.canvas.width, char.canvas.height);
}
// END HORIZONTAL MOVE

// START VERTICAL MOVE
function moveCharacterUp(char) {
    var tempCoordY = char.coordY - char.displacement;
    moveCharacterVertical(tempCoordY, char);
}
function moveCharacterDown(char) {
   
    var tempCoordY = char.coordY + char.displacement;
    moveCharacterVertical(tempCoordY, char);
}
function moveCharacterVertical(y, char){
    var tempGridY = Math.floor(y / gridBlockSize);
    
    char.coordY = y;
    char.gridY = tempGridY;
    
    moveCharacter(char);

    char.context.clearRect(0, 0, char.canvas.width, char.canvas.height);
}
// END VERTICAL MOVE

// MOVE CHARACTER
function moveCharacter(char){
    // Get current coordinates and index of game array
    var previousCoordX = char.gridX * gridBlockSize;
    var previousCoordY = char.gridY * gridBlockSize;
    var gameGridIndex = char.gridY * blocksPerRow + char.gridX;
    
    // Move PacMan
    if (char.myName == 'pacMan') {

        // Consume dot
        if(gameGridArray[gameGridIndex] == "1"){
            // record consumption of dot
            dotsRemaining--;
            dotsConsumed++;
            score = score + 10;
            if(player1.active){
                document.getElementById("score1").innerHTML = "" + score;
            }
            else{
                document.getElementById("score2").innerHTML = "" + score;

            }
            if ((char.gridX % 2==0 || char.gridY % 2==0) &! (char.gridX % 2==0 && char.gridY % 2==0)) {
                sound_dot2.play();
            }
            else {
                sound_dot.play();
            }
        }
        // Consume Power Dot
        else if (gameGridArray[gameGridIndex] == "2") {
            sound_pacman_power1.play();
            
            // record consumption of dot
            dotsRemaining--;
            dotsConsumed++;
            score = score + 50;
            if(player1.active){
                document.getElementById("score1").innerHTML = "" + score;
            }
            else{
                document.getElementById("score2").innerHTML = "" + score;

            }
            
            // POWER UP!!
            for(var i = 0; i < ghosts.length; i++){
                if(ghost.mode != CONSUMED){
                    ghosts[i].mode = BLINKING;
                    reverseDirection(ghosts[i]);
                }
            }
            
            // Ghosts are scared, wait some time and send them back to chase
            setTimeout(setBackToChase, 7000);
        }

        // No more dots remain
        if(dotsRemaining == 0){
            document.getElementById('gameWon').style.display = '';
            gameOver = true;
        }

        // Release the KRAKEN!!! ... no Kraken? oh well inky will do.
        if(dotsConsumed > 30){
            inky.readyToRelease = true;
        }

        // Clyde, come out and play!!!
        if(dotsConsumed > dotsRemaining*2){
            clyde.readyToRelease = true;
        }

        // Set array to empty cell 
        gameGridArray[gameGridIndex] = "0";

        // remove dot
        context.clearRect(previousCoordX-wallLineWidth, previousCoordY-wallLineWidth, gridBlockSize+wallLineWidth*2, gridBlockSize+wallLineWidth*2);
    }
}

// This reverses the direction the character is going... did you guess that?
function reverseDirection(char){
    switch (char.curDirection){
        case UP:
            char.curDirection = DOWN;
            break;
        case DOWN:
            char.curDirection = UP;
            break;
        case LEFT:
            char.curDirection = RIGHT;
            break;
        case RIGHT:
            char.curDirection = LEFT;
            break;
    }
    
}

// Set ghosts to chase mode!!!
function setBackToChase(){
    for(var i = 0; i < ghosts.length; i++){
        if(ghosts[i].mode != CONSUMED){
            ghosts[i].mode = CHASE;
        }
    }
    sound_pacman_power1.stop();
}

function isCharacterInCenter(character){
    // Return weather the character is in the center of their grid
        return (
        (character.coordX == character.gridX * gridBlockSize + gridBlockSize/2)
        &&
        (character.coordY == character.gridY * gridBlockSize + gridBlockSize/2)
    );
}

function canCharacterMoveInDirection(character, direction){
    var gameGridIndex;
    switch (direction){
        case UP:
            gameGridIndex = character.gridY * blocksPerRow + character.gridX - blocksPerRow;
            return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
            break;
        case DOWN:
            gameGridIndex = character.gridY * blocksPerRow + character.gridX + blocksPerRow;
            return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
            break;
        case RIGHT:
            gameGridIndex = character.gridY * blocksPerRow + character.gridX + 1;
            return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
            break;
        case LEFT:
            gameGridIndex = character.gridY * blocksPerRow + character.gridX - 1;
            return (gameGridArray[gameGridIndex] == 0 || gameGridArray[gameGridIndex] ==1 || gameGridArray[gameGridIndex] == 2);
            break;
        default:
            return false;
    }
}

function playerCollision() {
    // Loop through ghosts and see if they have collided with Pac Man.... may he rest in peace, oh look a quarter!
    for (var i = 0; i < ghosts.length && !playersCollided; i++) {

        // Are they in the same grid coordinates
        if (ghosts[i].gridX == pacMan.gridX && ghosts[i] && ghosts[i].gridY == pacMan.gridY) {
            sound_pacman_background1.stop();

            // Can PacMan eat them??
            if (ghosts[i].mode == SCARED || ghosts[i].mode == BLINKING) {
                ghosts[i].mode = CONSUMED;
                sound_pacman_getghost.play();
                switch (numOfGhostsAte){
                    case 0:
                        score += 200;
                        numOfGhostsAte++;
                        break;
                    case 1:
                        score += 400;
                        numOfGhostsAte++;
                        break;
                    case 2:
                        score += 800;
                        numOfGhostsAte++;
                        break;
                    case 3:
                        score += 1600;
                        numOfGhostsAte++;
                        break;
                }
            }
            else if (ghosts[i].mode == CONSUMED) {
                // Increase ghost speed
                ghosts[i].displacement = 2;
                
                // Make sure coordinates are on even numbers
                // to ensure movement stays on course 
                if(ghosts[i].coordX % 2 != 0){
                    ghosts[i].coordX += 1;
                }
                else if (ghosts[i].coordY % 2 != 0){
                    ghosts[i].coordY += 1;
                }
            }
            else {
                //PACMAN DIES
                sound_pacman_death.play();
                livesLeft--;
                playersCollided = true;

                // GAME OVER!!!!
                if (livesLeft < 0 && !gameOver) {
                    if((player1.active && player2.lives >= 0 && !player2.gameOver) || (player2.active && player1.lives >= 0 && !player1.gameOver)){
                        switchPlayers();
                    }
                    else{
                        gameOver = true;
                        document.getElementById("gameOver").style.display = '';
                    }
                }
                else {
                    switchPlayers();
                }
            }
        }
    }
}

function switchPlayers(){
    var previousPlayer = '';
    var activePlayer = '';
    var switched = true;
    if(player1.active && !player2.gameOver && numOfPlayers > 1){
        player1.active = false;
        player2.active = true;
        activePlayer = player2;
        previousPlayer = player1;
        document.getElementById('readyPlayer2').style.display = '';
        document.getElementById('gameWon').style.display = 'none';
    }
    else if(player2.active && !player1.gameOver && numOfPlayers > 1){
        player1.active = true;
        player2.active = false;
        activePlayer = player1;
        previousPlayer = player2;
        document.getElementById('readyPlayer').style.display = '';
        document.getElementById('gameWon').style.display = 'none';
    }
    else if(player1.active){
        activePlayer = player1;
        previousPlayer = player2;
        switched = false;
        document.getElementById('readyPlayer').style.display = '';
    }
    else{
        activePlayer = player2;
        previousPlayer = player1;
        switched = false;
        document.getElementById('readyPlayer2').style.display = '';
    }

    // Load current game state into player
    if(switched){
        previousPlayer.gameGrid       =   gameGridArray.slice();
        previousPlayer.score          =   score.valueOf();
        previousPlayer.lives          =   livesLeft.valueOf();
        previousPlayer.dotsConsumed   =   dotsConsumed.valueOf();
        previousPlayer.gameOver       =   gameOver;
        document.getElementById("gameWon").style.display = 'none';

    }
    else
    {
        activePlayer.gameGrid       =   gameGridArray.slice();
        activePlayer.score          =   score.valueOf();
        activePlayer.lives          =   livesLeft.valueOf();
        activePlayer.dotsConsumed   =   dotsConsumed.valueOf();
        activePlayer.gameOver       =   gameOver;
    }
    
    // Draw active players game and set games values to active players state
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameGridArray = activePlayer.gameGrid;
    drawGame(activePlayer.gameGrid);
    backToStartingPosition();
    
    pacMan.isMoving = false;
    gameStarted = false;
    gameOver = activePlayer.gameOver;
    score = activePlayer.score;
    livesLeft = activePlayer.lives;
    dotsConsumed = activePlayer.dotsConsumed;

    //display correct amount of life images
    document.getElementById("life1").style.display = '';
    document.getElementById("life2").style.display = '';
    if (activePlayer.lives == 1) {
        document.getElementById("life2").style.display = 'none';
    }
    else if (activePlayer.lives == 0) {
        document.getElementById("life1").style.display = 'none';
        document.getElementById("life2").style.display = 'none';
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
    char.centerOfCage = (char.coordX == ghostCageCenterX && char.coordY == ghostCageCenterY);
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

function backToStartingPosition() {
    // Set the defaults
    setDefaults();

    // Clear the canvases 
    pacMan.context.clearRect(0, 0, pacMan.canvas.width, pacMan.canvas.height);

    for (var i = 0; i < ghosts.length ; i++) {
        ghosts[i].context.clearRect(0, 0, ghosts[i].canvas.width, ghosts[i].canvas.height);
        ghosts[i].mode = CHASE;
    }
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

function isAtCrossRoads(char) {
    var numOfOptions = 0;

    // Can the character move in different directions (Except backwards silly, can't move backwards!)
    if (canCharacterMoveInDirection(char, UP) && char.curDirection != DOWN) {
        numOfOptions++;
    }

    if (canCharacterMoveInDirection(char, DOWN) && char.curDirection != UP) {
        numOfOptions++;
    }

    if (canCharacterMoveInDirection(char, LEFT) && char.curDirection != RIGHT) {
        numOfOptions++;
    }

    if (canCharacterMoveInDirection(char, RIGHT) && char.curDirection != LEFT) {
        numOfOptions++;
    }

    return (numOfOptions > 1);
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
            char.coordX = char.gridX * gridBlockSize + gridBlockSize / 2;
        }
    }
}

function setDefaults() {
    pacMan.sprite.animationDef = pacMan.animationLoopRIGHT;

    pacMan.gridX = 15;
    pacMan.gridY = 24;
    pacMan.coordX = pacMan.gridX * gridBlockSize;
    pacMan.coordY = pacMan.gridY * gridBlockSize + gridBlockSize / 2;
    pacMan.curDirection = "right";
    pacMan.desDirection = "right";
    pacMan.sprite.startingFrame = 2;
    pacMan.sprite.loaded = false;
    pacMan.displacement = 1.25;

    blinky.mode = CHASE;
    blinky.coordX = ghostStartingX;
    blinky.gridX = blinky.coordX / gridBlockSize;
    blinky.coordY = ghostStartingY;
    blinky.gridY = (blinky.coordY - gridBlockSize / 2) / gridBlockSize;
    blinky.targetX = blocksPerRow * gridBlockSize;
    blinky.targetY = 0;
    blinky.curDirection = "right";
    blinky.isActive = true;
    blinky.isMoving = true;
    blinky.sprite.loaded = false;
    blinky.readyToRelease = true;
    blinky.sprite.animationDef = blinky.animationLoopRIGHT;
    blinky.displacement = 1;

    inky.mode = CHASE;
    inky.coordX = 266;
    inky.gridX = inky.coordX / gridBlockSize;
    inky.coordY = 300;
    inky.gridY = (inky.coordY - gridBlockSize / 2) / gridBlockSize;
    inky.isActive = false;
    inky.targetX = blocksPerRow * gridBlockSize;
    inky.targetY = blocksPerRow * gridBlockSize;
    inky.curDirection = "right";
    inky.isActive = false;
    inky.sprite.loaded = false;
    inky.readyToRelease = false;
    inky.isMoving = false;
    inky.sprite.animationDef = inky.animationLoopRIGHT;
    inky.displacement = 1;

    pinky.mode = CHASE;
    pinky.coordX = 302;
    pinky.gridX = pinky.coordX / gridBlockSize;
    pinky.coordY = 300;
    pinky.gridY = (pinky.coordY - gridBlockSize / 2) / gridBlockSize;
    pinky.targetX = 0;
    pinky.targetY = 0;
    pinky.readyToRelease = true;
    pinky.curDirection = 'left';
    pinky.isActive = false;
    pinky.sprite.loaded = false;
    pinky.isMoving = false;
    pinky.sprite.animationDef = pinky.animationLoopRIGHT;
    pinky.displacement = 1;

    clyde.mode = CHASE;
    clyde.coordX = 338;
    clyde.gridX = clyde.coordX / gridBlockSize;
    clyde.coordY = 300;
    clyde.gridY = (clyde.coordY - gridBlockSize / 2) / gridBlockSize;
    clyde.targetX = 0;
    clyde.targetY = blocksPerRow * gridBlockSize;
    clyde.curDirection = 'right';
    clyde.isActive = false;
    clyde.isMoving = false;
    clyde.sprite.loaded = false;
    clyde.sprite.animationDef = clyde.animationLoopRIGHT;
    clyde.displacement = 1;
    clyde.readyToRelease = false;
}