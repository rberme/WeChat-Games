import { MAPS } from "./Data"
const MapWide = 7;
const MapHigh = 9;
const TILESIZE = 16;


class MapObj {
    Collide = 0;
    resID = 1;
    constructor() {

    }

    Draw(gameRes){

    }
}

export default class Map {

    constructor(layer, mapX, mapY) {
        this.x = this.y = 0;
        this.mapGround = MAPS["Map" + layer + "_" + mapX + "_" + mapY];
        this.mapObjects = null;

    }

    Update() {

    }

    DrawGround(gameRes, frame) {
        for (let i = 0; i < this.mapGround.length; i++) {
            let x = i % MapWide * TILESIZE + this.x;
            let y = Math.floor(i / MapWide) * TILESIZE + this.y+TILESIZE;
            gameRes.RenderTile(this.mapGround[i], x, y, frame);
        }
    }

    DrawItem(gameRes, frame) {

    }
}