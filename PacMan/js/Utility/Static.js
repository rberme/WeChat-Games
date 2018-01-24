//import Pool from './base/pool'

export const Global = {
    TileWidth: 32,
    TileHeight: 32,
    WorldRoomWidth: 5,
    WorldRoomHeight: 5,
    //inventoryHeight: 42,
    DungeonWide: 20
};

let COLUMNS = 19;

let scaleFactor = COLUMNS / 28;

/**
 * 全局状态管理器
 */
let instance
export default class Static {
    // let gameState
    constructor() {

        if (instance)
            return instance

        instance = this

        this.PINKY_LEAD_DIST = Math.ceil(4 * scaleFactor);
        this.INKY_LEAD_DIST = Math.ceil(2 * scaleFactor);
        this.CLYDE_BUFFER_SIZE = Math.ceil(8 * scaleFactor);
        //this.Performance = wx.getPerformance();
        
    }


    reset(canvas) {
        this.screenWidth = canvas.width;
        this.screenHeight = canvas.height;
        this.inventoryHeight = 60 * canvas.width / 375;
        this.AdaptRate = 608 / this.screenWidth;
        this.frame = 0
        this.score = 0
        this.gameState = 0;
    }
}
