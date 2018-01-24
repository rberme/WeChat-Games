
import Ghost from './Ghost'

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
//var PINKY_LEAD_DIST = 4;

let Stat = new Static();
export default class Pinky extends Ghost {
    constructor(position) {
        super(position);
        this.nickname = "Pinky";
        this.targetDir = 3;
        this.width = 64;
        this.height = 64;
        this.type = 0;
    }

    updateTarget(pacman) {
        switch (this.state) {
            case 1:
                this.targetX = Math.floor(pacman.position.x / Global.TileWidth);
                this.targetY = Math.floor(pacman.position.y / Global.TileHeight);
                switch (pacman.direction) {//0右 1左 2上 3下
                    case 2://0:
                        this.targetY -= Stat.PINKY_LEAD_DIST;
                        break;
                    case 1:
                        this.targetX -= Stat.PINKY_LEAD_DIST;
                        break;
                    case 3://2:
                        this.targetY += Stat.PINKY_LEAD_DIST;
                        break;
                    case 0://3:
                        this.targetX += Stat.PINKY_LEAD_DIST;
                        break;
                }
                break;
            case 2:
                this.targetX = 2;
                this.targetY = -2;
                break;

        }


    }

}