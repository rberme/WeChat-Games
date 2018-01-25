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

// let tileCollide = new TileCollide();
export default class Player {
    constructor(mainRef) {
        this.mainRef = mainRef;
        this.pos = [ACTORINITIAL[0].x * BLOCKSIZE + BLOCKSIZE / 2, ACTORINITIAL[0].y * BLOCKSIZE + BLOCKSIZE / 2];
        this.dir = PM_DIRECTION.LEFT;
        this.requestDir = 0;
    }

    update() {

    }


    render(gameRes) {
        if (this.dir) {
            this.idx = Math.floor(this.mainRef.frame / 3) % 4;
            this.idx += Dir2Anim[this.dir] * 4;
        }
        gameRes.renderImage(pacmanAnim[this.idx], this.pos[0], this.pos[1] + this.mainRef.worldMap.playfieldY, 1, 1);
    }
}