/**
 * Created by bzweifel on 9/22/15.
 */
$(document).ready(function(){
    console.log("JQuery is Ready")
    setTimeout(function () {
        $("#credits").html("Credits: 1")
    }, 200);
    var pacManCanvas = document.getElementById("pacman");
    var pacManContext = pacManCanvas.getContext("2d");
    
    var pacManRadius = gridBlockSize - gridBlockSize/4;
    var pacManMouth = Math.PI/6;
    var gameStarted = false;
    
    var character = function(){
        this.gridX           = 15;
        this.gridY           = 24;
        this.coordX          = this.gridX * gridBlockSize;
        this.coordY          = this.gridY * gridBlockSize + gridBlockSize/2;
        // characters velocity is displacement/milliseconds ( 5px per 100 milliseconds)
        this.displacement    = 5; //in pixels
        this.milliseconds     = 100;
        this.curDirection    = "right";
        this.desDirection    = "right";
    };
    var pacMan = new character();

    function renderContent(){
        context.save();
        drawPacMan();
        context.restore();
    }

    function drawPacMan(){
            pacManContext.lineWidth = pacManRadius;
            pacManContext.strokeStyle = "yellow";

            pacManContext.beginPath();
        pacManContext.arc(pacMan.coordX, pacMan.coordY, pacManRadius/2, pacManMouth , 2 * Math.PI - (pacManMouth));
            pacManContext.stroke();
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
    
    window.addEventListener('keydown',checkKey,true);
    renderContent();
});
