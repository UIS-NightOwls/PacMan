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
        this.gridX           = 15,
        this.gridY           = 24,
        this.coordX          = this.gridX * gridBlockSize,
        this.coordY          = this.gridY * gridBlockSize + gridBlockSize/2,
        this.speed           = 5,
        this.curDirection    = "right",
        this.desDirection    = "right"
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
        if(!gameStarted){
            gameStarted = true;
            movePacMan();
        }
        //context.clearRect(0,0,canvas.width,canvas.height);
        //renderContent();
        //document.getElementById("debug-help").innerHTML = "(" + pacManGridX + ", " + pacManGridY + ") (" + pacManCoordX + ", " + pacManCoordY + ")";
    }
    
    function movePacMan(){
        var keepMoving = true;
        if(isCharacterinCenter(pacMan)){
            if(canCharacterMoveinDirection(pacMan, pacMan.desDirection)){
                pacMan.curDirection = pacMan.desDirection;
                movePacManInCurrentDirection();
            }
            else{
                if(canCharacterMoveinDirection(pacMan, pacMan.curDirection)){
                    pacMan.desDirection = pacMan.curDirection;
                    movePacManInCurrentDirection();
                }
                else{
                    // stop PacMan
                    keepMoving = false;
                }
            }
        }
        else{
            movePacManInCurrentDirection();
        }
        
        if(keepMoving){
            setTimeout(function(){
                movePacMan();
            }, 100);
        }
    }
    
    function movePacManInCurrentDirection(){
        var dir = pacMan.curDirection;
        switch (dir){
            case 'up':
                movePacManUp();
                break;
            case 'down':
                movePacManDown();
                break;
            case 'right':
                movePacManRight();
                break;
            case 'left':
                movePacManLeft();
                break;
            default:
                return false;
        }
    }
    
    function movePacManRight(){
        var tempCoordX = pacMan.coordX + pacMan.speed;
        movePacManHorizontal(tempCoordX);
    }
    function movePacManLeft(){
        var tempCoordX = pacMan.coordX - pacMan.speed;
        movePacManHorizontal(tempCoordX);
    }
    function movePacManHorizontal(x){
        var tempGridX = Math.floor(x / gridBlockSize);
        var gameGridIndex = pacMan.gridY * blocksPerRow + tempGridX;
        var previousCoordX = pacMan.gridX * gridBlockSize;
        var previousCoordY = pacMan.gridY * gridBlockSize;
    
        gameGridArray[gameGridIndex] = "0";
        pacMan.coordX = x;
        pacMan.gridX = tempGridX;
        //Power up
        
        document.getElementById("debug-help2").innerHTML = gameGridArray[gameGridIndex-1] + " " + gameGridArray[gameGridIndex] + " " + gameGridArray[gameGridIndex+1];

        context.clearRect(previousCoordX-wallLineWidth,previousCoordY-wallLineWidth,gridBlockSize+wallLineWidth*2,gridBlockSize+wallLineWidth*2);
        pacManContext.clearRect(0,0,pacManCanvas.width,pacManCanvas.height);
        
        drawPacMan();
    }
    function movePacManUp(){
        var tempCoordY = pacMan.coordY - pacMan.speed;
        movePacManVertical(tempCoordY);
    }
    function movePacManDown(){
        var tempCoordY = pacMan.coordY + pacMan.speed;
        
        movePacManVertical(tempCoordY);
    }
    function movePacManVertical(y){
        var tempGridY = Math.floor(y / gridBlockSize);
        var gameGridIndex = tempGridY * blocksPerRow + pacMan.gridX;
        var previousCoordX = pacMan.gridX * gridBlockSize;
        var previousCoordY = pacMan.gridY * gridBlockSize;
        
        gameGridArray[gameGridIndex] = "0";
        pacMan.coordY = y;
        pacMan.gridY = tempGridY;
        
        document.getElementById("debug-help2").innerHTML = gameGridArray[gameGridIndex-1] + " " + gameGridArray[gameGridIndex] + " " + gameGridArray[gameGridIndex+1];
        context.clearRect(previousCoordX-wallLineWidth,previousCoordY-wallLineWidth,gridBlockSize+wallLineWidth*2,gridBlockSize+wallLineWidth*2);
        pacManContext.clearRect(0,0,pacManCanvas.width,pacManCanvas.height);
        drawPacMan();
    }
    
    function isCharacterinCenter(character){
        return (
            (character.coordX == character.gridX * gridBlockSize + gridBlockSize/2)
            &&
            (character.coordY == character.gridY * gridBlockSize + gridBlockSize/2)
        )
    }
    
    function canCharacterMoveinDirection(character, direction){
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
