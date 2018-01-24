
import GameObject from "./GameObject"

import { Global } from '../Utility/Static'
import Static from '../Utility/Static'

let Stat = new Static();

export default class Tile extends GameObject {
    constructor(position, isCollide, tileType) {
        super(position);
        this.width = Global.TileWidth;
        this.height = Global.TileHeight;
        this.isCollide = isCollide;
        this.id = tileType;
    }

    render(ctx) {
        ctx.drawImage(
            Stat.gameResource[0],
            this.id % 8 * this.width,
            Math.floor(this.id / 8) * this.height,
            this.width,
            this.height,
            (this.position.x-this.width / 2) / Stat.AdaptRate,
            (this.position.y - this.height / 2) / Stat.AdaptRate + Stat.inventoryHeight,
            this.width / Stat.AdaptRate,
            this.height / Stat.AdaptRate
        )
    }
}