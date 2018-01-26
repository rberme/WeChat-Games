import {
    ACTORINITIAL,
    BLOCKSIZE,
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

const halfBLOCKSIZE = (BLOCKSIZE >> 1);
// let tileCollide = new TileCollide();
export default class Player {
    constructor(mainRef) {
        this.id = 0;
        this.mainRef = mainRef;
    }

    resetPlayer() {
        this.pos = [ACTORINITIAL[0].x * BLOCKSIZE + halfBLOCKSIZE, ACTORINITIAL[0].y * BLOCKSIZE + halfBLOCKSIZE];
        this.tilePos = [this.pos[0], this.pos[1]];
        this.dir = ACTORINITIAL[0].dir;
        this.requestDir = 0;
        this.animIdx = 3;
        this.speed = this.fullSpeed;
    }

    update() {
        var b = (this.pos[0] - halfBLOCKSIZE) / 8,
            c = (this.pos[1] - halfBLOCKSIZE) / 8,
            tilePos = [Math.round(b) * 8, Math.round(c) * 8];
        if (tilePos[0]+halfBLOCKSIZE != this.tilePos[0] || tilePos[1]+halfBLOCKSIZE != this.tilePos[1]) {//移动到了新的块
            this.tilePos[0] = tilePos[0]+halfBLOCKSIZE;
            this.tilePos[1] = tilePos[1]+halfBLOCKSIZE

            if (this.mainRef.worldMap.playfield[tilePos[1]][tilePos[0]].dot){
                this.mainRef.dotEaten(this.id, tilePos);
                this.speed = this.dotEatingSpeed;
            }
            else this.speed = this.fullSpeed;
            this.mainRef.tilesChanged = true;
        }

        if (this.dir) {
            this.animIdx = Math.floor(this.mainRef.frame / 3) % 4;
            this.animIdx += Dir2Anim[this.dir] * 4;
        }
    }


    render(gameRes) {
        gameRes.renderImage(pacmanAnim[this.animIdx], this.pos[0], this.pos[1] + this.mainRef.worldMap.playfieldY, 1, 1);
    }

}