
import Ghost from './Ghost'

import Static from "../Utility/Static"
import { Global } from '../Utility/Static'

// var ghosts = [  // COLOR    CHARACTER   NICKNAME
//     blinky,     // RED      SHADOW      BLINKY
//     pinky,      // PINK     SPEEDY      PINKY
//     inky,       // BLUE     BASHFUL     INKY
//     clyde       // ORANGE   POKEY       CLYDE
// ];
//var CLYDE_BUFFER_SIZE = 100000;
var COLUMNS = 19;
var ROWS = 22;

let Stat = new Static();
export default class Clyde extends Ghost {
    constructor(position) {
        super(position);
        this.nickname = "Clyde";
        this.targetDir = 1;
        this.width = 64;
        this.height = 64;
        this.type = 2;
    }

    updateTarget(pacman) {
        switch (this.state) {
            case 1:
                let deltaX = this.position.x - pacman.position.x;
                let deltaY = this.position.y - pacman.position.y;
                if (Math.floor(deltaX / Global.TileWidth) + Math.floor(deltaY / Global.TileHeight) > Stat.CLYDE_BUFFER_SIZE) {
                    this.targetX = Math.floor(pacman.position.x / Global.TileWidth);
                    this.targetY = Math.floor(pacman.position.y / Global.TileHeight);
                }
                else {
                    this.targetX = 1;
                    this.targetY = ROWS - 2;
                }
                break;
            case 2:
                this.targetX = 0;
                this.targetY = 24;
                break;
        }
    }


}