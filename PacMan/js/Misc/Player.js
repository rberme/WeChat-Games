import {
    ACTORINITIAL,
    BLOCKSIZE,
    PM_DIRECTION,
} from './GameRes'

const pacmanAnim = [
    9, 10, 9, 6,//pacman上
    12, 13, 12, 6,//pacman下
    3, 5, 3, 6,//pacman左
    7, 8, 7, 6,//pacman右

    54, 55, 56, 55,//pacman右大 //

    57, 59, 60, 61, 61, 62, 63,//stick /

];

const Dir2Anim = {
    1: 0,
    2: 1,
    4: 2,
    8: 3,
}

const halfBLOCKSIZE = (BLOCKSIZE>>1);
// let tileCollide = new TileCollide();
export default class Player {
    constructor(mainRef) {
        this.mainRef = mainRef;
    }

    resetPlayer(){
        this.pos = [ACTORINITIAL[0].x * BLOCKSIZE + halfBLOCKSIZE, ACTORINITIAL[0].y * BLOCKSIZE + halfBLOCKSIZE];
        this.tilePos = [this.pos[0],this.pos[1]];
        this.dir = PM_DIRECTION.LEFT;
        this.requestDir = 0;
    }

    update() {
        var b = (this.pos[0] - halfBLOCKSIZE) / 8,
            c = (this.pos[1] - halfBLOCKSIZE) / 8,
            tilePos = [Math.round(b) * 8 + halfBLOCKSIZE, Math.round(c) * 8 + halfBLOCKSIZE];
        if (tilePos[0] != this.tilePos[0] || tilePos[1] != this.tilePos[1]) {//移动到了新的块
            this.tilePos[0] = tilePos[0];
            this.tilePos[1] = tilePos[1]
            this.mainRef.tilesChanged = true;
        }
    }


    render(gameRes) {
        if (this.dir) {
            this.idx = Math.floor(this.mainRef.frame / 3) % 4;
            this.idx += Dir2Anim[this.dir] * 4;
        }
        gameRes.renderImage(pacmanAnim[this.idx], this.pos[0], this.pos[1] + this.mainRef.worldMap.playfieldY, 1, 1);
    }
}