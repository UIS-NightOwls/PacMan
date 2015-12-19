// Define the pacman constructor. Pacman is a player (inheritance), but with several unique properties
function pacman(options) {
    
   /*********************************
   //PacMan Animation Loop Definitiions
   //(Requirements 3.3.3 - 3.3.18)
   **********************************/
    this.animationLoopUP = [[0, 0], [1, 1], [2, 1], [3, 1], [4, 1], [3, 1], [2, 1], [1, 1]];
    this.animationLoopRIGHT = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [3, 0], [2, 0], [1, 0]];
    this.animationLoopDOWN = [[0, 0], [1, 2], [2, 2], [3, 2], [4, 2], [3, 2], [2, 2], [1, 2]];
    this.animationLoopLEFT = [[0, 0], [1, 3], [2, 3], [3, 3], [4, 3], [3, 3], [2, 3], [1, 3]];

    // Call the parent constructor, making sure (using Function#call)
    // that "this" is set correctly during the call
    player.call(this, options);
    
}