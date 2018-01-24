
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
var INKY_LEAD_DIST = 2;

let Stat = new Static();
export default class Inky extends Ghost {
    constructor(position) {
        super(position);
        this.nickname = "Inky";
        this.targetDir = 0;
        this.width = 64;
        this.height = 64;
        this.type = 3;
    }

    update(pacman, map, mapWidth, mapHeight, blinky) {
        this.blinky = blinky;
        super.update(pacman, map, mapWidth, mapHeight);
    }

    updateTarget(pacman) {
        switch (this.state) {
            case 1:
                let tempX = Math.floor(pacman.position.x / Global.TileWidth);
                let tempY = Math.floor(pacman.position.y / Global.TileHeight);
                switch (pacman.direction) {//0右 1左 2上 3下
                    case 2://0:
                        tempY -= Stat.INKY_LEAD_DIST;
                        break;
                    case 1:
                        tempX -= Stat.INKY_LEAD_DIST;
                        break;
                    case 3://2:
                        tempY += Stat.INKY_LEAD_DIST;
                        break;
                    case 0://3:
                        tempX += Stat.INKY_LEAD_DIST;
                        break;
                }
                let blinkyX = Math.floor(this.blinky.x / Global.TileWidth);
                let blinkyY = Math.floor(this.blinky.y / Global.TileWidth);
                tempX -= blinkyX; tempX *= 2;
                tempY -= blinkyY; tempY *= 2;

                this.targetX = blinkyX + tempX;
                this.targetY = blinkyY + tempY;
                break;
            case 2:
                this.targetX = 18;
                this.targetY = 24;
                break;
        }

    }

}