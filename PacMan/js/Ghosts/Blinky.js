
import Ghost from './Ghost'//'../Misc/GameObject'

import Static from "../Utility/Static"
import { Global } from '../Utility/Static'

// var ghosts = [  // COLOR    CHARACTER   NICKNAME
//     blinky,     // RED      SHADOW      BLINKY
//     pinky,      // PINK     SPEEDY      PINKY
//     inky,       // BLUE     BASHFUL     INKY
//     clyde       // ORANGE   POKEY       CLYDE
// ];

var COLUMNS = 19;
var ROWS = 22;

let Stat = new Static();
export default class Blinky extends Ghost {
    constructor(position) {
        super(position);
        this.nickname = "blinky";
        this.targetDir = 1;
        this.width = 64;
        this.height = 64;
        this.type = 1;
    }


    updateTarget(pacman) {
        switch (this.state) {
            case 1://追击
                this.targetX = Math.floor(pacman.position.x / Global.TileWidth);
                this.targetY = Math.floor(pacman.position.y / Global.TileHeight);
                break;
            case 2://散开
                this.targetX = 16;
                this.targetY = -2;
                break;
        }
    }

}