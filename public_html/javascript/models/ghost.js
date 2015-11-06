// Define the ghost constructor. Ghosts are players (inheritance), but with several unique properties
function ghost(options) {
    //console.log("GHOST OPTIONS:", options)
    this.mode = 'chase';    //  modes for ghosts: chase, scatter, consumed, blinking
    this.targetX = 0;       //  ghosts have targets they are trying to reach
    this.targetY = 0;
    //this.myImage = "";
   // this.scaredImage = ghostScared;
    this.readyToRelease = false;
    this.centerOfCage = false;
    this.countMode = 0;

    this.animationLoopSCARED = [[0, 4], [1, 4]];
    this.animationLoopBLINK = [[0, 4], [1, 4], [2, 4], [3, 4]]; 

    this.animationLoopCONSUMEDRIGHT = [[4, 4], [4, 4]];
    this.animationLoopCONSUMEDUP = [[4, 5], [4, 5]];
    this.animationLoopCONSUMEDOWN = [[4, 6], [4, 6]];
    this.animationLoopCONSUMEDLEFT = [[4, 7], [4, 7]];
   

    if (options.myName == 'blinky') {     
        this.animationLoopUP = [[0, 6], [1, 6]];
        this.animationLoopRIGHT = [[0, 5], [1, 5]];
        this.animationLoopDOWN = [[0, 7], [1, 7]];
        this.animationLoopLEFT = [[0, 8], [1, 8]];
    }
    else if (options.myName == 'inky') {
        this.animationLoopUP = [[2, 6], [3, 6]];
        this.animationLoopRIGHT = [[2, 5], [3, 5]];
        this.animationLoopDOWN = [[2, 7], [3, 7]];
        this.animationLoopLEFT = [[2, 8], [3, 8]];
    }
    else if (options.myName == 'pinky') {
        this.animationLoopUP = [[4, 6], [5, 6]];
        this.animationLoopRIGHT = [[4, 5], [5, 5]];
        this.animationLoopDOWN = [[4, 7], [5, 7]];
        this.animationLoopLEFT = [[4, 8], [5, 8]];
    }
    else { // clyde
        this.animationLoopUP = [[6, 6], [7, 6]];
        this.animationLoopRIGHT = [[6, 5], [7, 5]];
        this.animationLoopDOWN = [[6, 7], [7, 7]];
        this.animationLoopLEFT = [[6, 8], [7, 8]];
    }

    //inherit other properties from base class and call constructor
    player.call(this, options);
}