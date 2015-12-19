/*******************************
* Graphics - Sprites
* (Requirements 3.3, 3.4.0) 
*******************************/
//Sprite Class
function sprite(options) {
    var that = {},
        i = 0, //frameIndex
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.animationDef.length || 1;
    that.parent = options.parent;
    that.context = options.context;
    that.spriteSize = options.spriteSize || 32;
    that.width = numberOfFrames * that.spriteSize;
    that.height = that.spriteSize;
    that.image = options.image;
    that.tickCount = 0;
    that.animationPlaying = options.animationPlaying || false;
    that.startingFrame = options.startingFrame || 0;
    that.animationDef = options.animationDef;
    that.loaded = false;

    that.image.addEventListener("load", spriteImageLoaded);
    that.image.src = options.src;

    var parent = this;

    function spriteImageLoaded() {
        if (!that.loaded) {
            that.firstLoad();
        }
       
        window.requestAnimationFrame(spriteImageLoaded);       
        that.update();
      
        that.render();

    }

    //Each framerate tick will check to see if its time to move to the next frame of the animation
    that.update = function () {
        if (that.animationPlaying) {
            that.tickCount += 1;
            if (that.tickCount > ticksPerFrame) {
                that.tickCount = 0;
                // If the current frame index is in range
                if (i < numberOfFrames - 1) {
                    // Go to the next frame
                    i += 1;
                } else {
                    i = 0;
                }
            }
        }
    };
    that.spriteSizeHalf = that.spriteSize / 2;

    //Load the first defined frame of the animation definition.
    that.firstLoad = function () {

        that.loaded = true;
        that.animationPlaying = false;

        // Load startingFrame
        that.context.drawImage(
          that.image, //Sprite sheet
          that.animationDef[that.startingFrame][0] * that.spriteSize, //Source x
          that.animationDef[that.startingFrame][1] * that.spriteSize, //Source y
          that.spriteSize,
          that.spriteSize,
          //10, 10, that.spriteSize, that.spriteSize);
          that.parent.coordX - that.spriteSizeHalf,
          that.parent.coordY - that.spriteSizeHalf,
          //that.parent.coordX +
          that.spriteSize,
         // that.parent.coordY +
          that.spriteSize);
          numberOfFrames = options.animationDef.length
    };

    /*******************************
    * Collision Detection (animation)
    * (Requirements 3.6, 6.1.1 - 6.1.7) 
    *******************************/

    that.render = function () {
       
        if (that.animationPlaying) {
            //  modes for ghosts: chase, scatter, consumed  
            if (that.parent.mode == "scared") {
                that.animationDef = that.parent.animationLoopSCARED;
            }
            else if (that.parent.mode == "blinking") {
                that.animationDef = that.parent.animationLoopBLINK;
            }
            else { //THESE WORK FOR PACMAN AND GHOSTS
                switch (that.parent.curDirection) {
                    case "right":
                        if (that.parent.mode == "consumed") {
                            that.animationDef = that.parent.animationLoopCONSUMEDRIGHT;
                        }                     
                        else {
                            that.animationDef = that.parent.animationLoopRIGHT;
                        }
                        break;
                    case "up":
                        if (that.parent.mode == "consumed") {
                            that.animationDef = that.parent.animationLoopCONSUMEDUP;
                        }
                        else {
                            that.animationDef = that.parent.animationLoopUP;
                        }
                        break;
                    case "down":
                        if (that.parent.mode == "consumed") {
                            that.animationDef = that.parent.animationLoopCONSUMEDOWN;
                        }
                        else {
                            that.animationDef = that.parent.animationLoopDOWN;
                        }
                        break;
                    default:
                        if (that.parent.mode == "consumed") {
                            that.animationDef = that.parent.animationLoopCONSUMEDLEFT;
                        }
                        else {
                            that.animationDef = that.parent.animationLoopLEFT;
                        }
                        break;
                }
            }
            
            // Clear the canvas
            that.context.clearRect(0, 0, that.width, that.height);
            // Draw the animation
            that.context.drawImage(
              that.image, //Sprite sheet
              that.animationDef[i][0] * that.spriteSize, //Source x
              that.animationDef[i][1] * that.spriteSize, //Source y
              that.spriteSize,
              that.spriteSize,
              that.parent.coordX - that.spriteSizeHalf,
              that.parent.coordY - that.spriteSizeHalf,
              that.spriteSize,
              that.spriteSize);

            numberOfFrames = options.animationDef.length
        }
    };

    return that;
}
//End Sprite