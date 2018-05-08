import { MAPS } from "./Data"
const MapWide = 7;
const MapHigh = 8;
const TILESIZE = 16;


class MapObj {
    Collide = 0;
    resID = 1;
    constructor() {

    }

    Draw(gameRes) {

    }
}

export default class Map {

    constructor(layer, mapX, mapY) {
        this.x = this.y = 0;
        this.mapBottom = [];
        this.mapTop = {};
        let mapData = MAPS["Map" + layer + "_" + mapX + "_" + mapY];
        for (let i = 0; i < mapData.length; ++i) {
            this.mapBottom[i] = mapData[i] & 0b11111111;
            let temp = (mapData[i] >> 8) & 0b11111111;
            if (temp > 0)
                this.mapTop[i] = temp;
        }
        this.mapObjects = null;

    }

    Update() {

    }

    DrawGround(gameRes, frame) {
        for (let i = 0; i < this.mapBottom.length; i++) {
            if (this.mapBottom[i] <= 0)
                continue;
            let x = i % MapWide * TILESIZE + this.x;
            let y = Math.floor(i / MapWide) * TILESIZE + this.y + TILESIZE;
            gameRes.RenderTile(this.mapBottom[i], x, y, frame);
        }

        for (let i in this.mapTop) {
            let x = i % MapWide * TILESIZE + this.x;
            let y = Math.floor(i / MapWide) * TILESIZE + this.y + TILESIZE;
            gameRes.RenderTile(this.mapTop[i], x, y, frame);

        }
    }

    DrawItem(gameRes, frame) {

    }
}