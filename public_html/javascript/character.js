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

function moveCharInCurrentDirection(char){
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

    if(char.myName == 'pacMan' ){
        if(gameGridArray[gameGridIndex] == "1"){
            dotsRemaining--;
            dotsConsumed++;
            score = score + 10;
            document.getElementById("score").innerHTML = "" + score;
        }
        else if(gameGridArray[gameGridIndex] == "2"){
            dotsRemaining--;
            dotsConsumed++;
            score = score + 10;
            document.getElementById("score").innerHTML = "" + score;
            
            // POWER UP!!
            for(var i = 0; i < ghosts.length; i++){
                if(ghosts[i].isActive){
                    ghosts[i].mode = 'scared';
                    reverseDirection(ghosts[i]);

                }
            }

            setTimeout(setBackToChase, 7000);
        }

        if(dotsConsumed == 30){
            inky.readyToRelease = true;
        }

        if(dotsConsumed > dotsRemaining*2){
            clyde.readyToRelease = true;
        }
        
        gameGridArray[gameGridIndex] = "0";

        context.clearRect(previousCoordX-wallLineWidth, previousCoordY-wallLineWidth, gridBlockSize+wallLineWidth*2, gridBlockSize+wallLineWidth*2);
    }
    char.coordX = x;
    char.gridX = tempGridX;
    
    char.myContext.clearRect(0,0,canvas.width,canvas.height);
    
    drawCharacter(char);
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
    var gameGridIndex = tempGridY * blocksPerRow + char.gridX;
    var previousCoordX = char.gridX * gridBlockSize;
    var previousCoordY = char.gridY * gridBlockSize;

    if(char.myName == 'pacMan'){
        if(gameGridArray[gameGridIndex] == "1"){
            dotsRemaining--;
            dotsConsumed++;
            score = score + 10;
            document.getElementById("score").innerHTML = "" + score;
        }
        else if(gameGridArray[gameGridIndex] == "2"){
            dotsRemaining--;
            dotsConsumed++;
            score = score + 10;
            document.getElementById("score").innerHTML = "" + score;

            // POWER UP!!
            for(var i = 0; i < ghosts.length; i++){
                if(ghosts[i].isActive){
                    ghosts[i].mode = 'scared';
                    reverseDirection(ghosts[i]);
                }
            }
            
            setTimeout(setBackToChase, 7000);
        }
        
        if(dotsConsumed == 30){
            inky.readyToRelease = true;
        }
        
        if(dotsConsumed > dotsRemaining*2){
            clyde.readyToRelease = true;
        }
        
        gameGridArray[gameGridIndex] = "0";

        context.clearRect(previousCoordX-wallLineWidth, previousCoordY-wallLineWidth, gridBlockSize+wallLineWidth*2, gridBlockSize+wallLineWidth*2);
    }
    char.coordY = y;
    char.gridY = tempGridY;

    char.myContext.clearRect(0, 0, canvas.width, canvas.height);
    
    drawCharacter(char);
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

function drawCharacter(char){
    if(char.mode == 'scared'){
        drawSprite(char.scaredImage, char.coordX - spriteSize / 2, char.coordY - spriteSize / 2, char.curDirection, char.myContext);
    }
    else{
        drawSprite(char.myImage, char.coordX - spriteSize / 2, char.coordY - spriteSize / 2, char.curDirection, char.myContext);
    }
}
        