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

function moveCharInThisDirection(char,dir){
    switch (dir){
        case UP:
            moveCharacterUp(char);
            break;
        case DOWN:
            moveCharacterDown(char);
            break;
        case LEFT:
            moveCharacterLeft(char);
            break;
        case RIGHT:
            moveCharacterRight(char);
            break;
    }
}

function moveCharInCurrentDirection(char) {
   
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

   // console.log("moveCharacterHorizontal",char)
    
    char.context.clearRect(0, 0, char.canvas.width, char.canvas.height);
    
    drawCharacter(char);
}
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
    
    drawCharacter(char);
}

function moveCharacter(char){
    var previousCoordX = char.gridX * gridBlockSize;
    var previousCoordY = char.gridY * gridBlockSize;
    var gameGridIndex = char.gridY * blocksPerRow + char.gridX;

   // console.log("moveCharacter",char.myName)

    if (char.myName == 'pacMan') {

     //   console.log("moveCharacter pacMan",char)



        if(gameGridArray[gameGridIndex] == "1"){
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
        else if (gameGridArray[gameGridIndex] == "2") {

            sound_pacman_power1.play();

            console.log("POWER UP")
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
            setTimeout(function () {
              
                for (var i = 0; i < ghosts.length; i++) {
                    if (ghosts[i].isActive) {
                        ghosts[i].mode = 'blinking';
                       // reverseDirection(ghosts[i]);
                    }
                }
            }, 5000);

            setTimeout(setBackToChase, 7000);
        }

        if(dotsRemaining == 0){
            document.getElementById('gameWon').style.display = '';
            gameOver = true;
        }

        if(dotsConsumed == 30 && !inky.isActive){
            inky.readyToRelease = true;
        }

        if(dotsConsumed > dotsRemaining*2){
            clyde.readyToRelease = true;
        }

        gameGridArray[gameGridIndex] = "0";

        context.clearRect(previousCoordX-wallLineWidth, previousCoordY-wallLineWidth, gridBlockSize+wallLineWidth*2, gridBlockSize+wallLineWidth*2);
    }
}

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

function setBackToChase(){
    for(var i = 0; i < ghosts.length; i++){
        if(ghosts[i].isActive){
            ghosts[i].mode = 'chase';
        }
    }
    sound_pacman_power1.stop();
}

function isCharacterInCenter(character){
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

function drawSprite(img, x, y, dir, charContext) {
    charContext.drawImage(img, x, y);
}

function drawCharacter(char) {
   
    
}
        