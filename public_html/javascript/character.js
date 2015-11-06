/**
 * Created by bzweifel on 10/27/15.
 */
// Below are functions to be used by Ghosts and PacMan
var spriteSize = 32;
var dotsConsumed = 0;
var score = 0;
var UP = 'up';
var DOWN = 'down';
var LEFT = 'left';
var RIGHT = 'right';

var startPowerTimer = "";

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
  //  console.log("moveCharacterUp",  eval(char.sprite.animationDef))
  
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
            document.getElementById("score").innerHTML = "" + score;
           // console.log(char.gridY, char.gridX, (char.gridX % 2 == 0 || char.gridY % 2 == 0))
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
            console.log("POWER UP");
            
            // record consumption of dot
            dotsRemaining--;
            dotsConsumed++;
            score = score + 50;
            document.getElementById("score").innerHTML = "" + score;

            // POWER UP!!
            for(var i = 0; i < ghosts.length; i++){
                if(ghosts[i].isActive){
                    ghosts[i].mode = 'scared';
                    reverseDirection(ghosts[i]);
                }
            }
            //setTimeout(function () {
            //  
            //    for (var i = 0; i < ghosts.length; i++) {
            //        if (ghosts[i].isActive) {
            //            ghosts[i].mode = 'blinking';
            //           // reverseDirection(ghosts[i]);
            //        }
            //    }
            //}, 5000);
            
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
        if(ghosts[i].isActive){
            ghosts[i].mode = 'chase';
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