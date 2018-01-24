import {
    ACTORINITIAL,
    BLOCKSIZE,
    PM_DIRECTION,
} from './GameRes'

// let tileCollide = new TileCollide();
export default class Player {
    constructor(mainRef) {
        this.mainRef = mainRef;
        this.pos = [ACTORINITIAL[0].x * BLOCKSIZE + BLOCKSIZE / 2, ACTORINITIAL[0].y * BLOCKSIZE + BLOCKSIZE/2];
        this.dir = PM_DIRECTION.LEFT;
    }

    update(){

    }


    render(gameRes) {
        gameRes.renderImage(3, this.pos[0], this.pos[1] + this.mainRef.worldMap.playfieldY,1,1);
    }
}