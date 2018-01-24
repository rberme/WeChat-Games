
import {
    ACTORMODE,
    GAMEMODE,
    PM_DIRECTION,
} from "./Misc/GameRes"

import GameRes from "./Misc/GameRes"
import WorldMap from './Misc/WorldMap'
import Player from './Misc/Player'
import TileCollide from './Misc/TileCollide'

let PlatformDifference = {
    "ios": {
        touchstart: "ontouchstart",
        touchmove: "ontouchmove",
        touchcancel: "ontouchcancel",
        touchend: "ontouchend"
    },
    "android": {
        touchstart: "ontouchstart",
        touchmove: "ontouchmove",
        touchcancel: "ontouchcancel",
        touchend: "ontouchend"
    },
    "devtools": {
        touchstart: "touchstart",
        touchmove: "touchmove",
        touchcancel: "touchcancel",
        touchend: "touchend"
    }
}

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);
let tileCollide = new TileCollide();

const DEFAULT_FPS = 60;
/**
 * 游戏主函数
 */

export default class Main {
    constructor() {
        this.platform = "devtools";//ios
        this.touchHandler = this.touchEventHandler.bind(this)
        wx.onTouchStart(this.touchHandler);
        wx.onTouchEnd(this.touchHandler);
        wx.onTouchCancel(this.touchHandler);

        this.restart()
    }

    //游戏结束后的触摸事件处理逻辑
    touchEventHandler(e) {
        // e.preventDefault()
        if (e.type == PlatformDifference[this.platform].touchstart) {
            this.touchStartX = e.touches[0].clientX
            this.touchStartY = e.touches[0].clientY
        } else if (e.type == PlatformDifference[this.platform].touchend) {

            let deltaX = e.changedTouches[0].clientX - this.touchStartX;
            let deltaY = e.changedTouches[0].clientY - this.touchStartY;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0.5)//右
                    this.player.dir = 8;
                else if (deltaX < -0.5)//左
                    this.player.dir = 4;
            }
            else {
                if (deltaY > 0.5)//下
                    this.player.dir = 2;
                else if (deltaY < -0.5)//上
                    this.player.dir = 1;
            }

        }
    }

    restart() {
        this.frame = 0;
        this.worldMap = new WorldMap(this);
        this.worldMap.determinePlayfieldDimensions();
        this.worldMap.preparePlayfield();
        this.worldMap.preparePaths();
        this.mapAdj = this.worldMap.adjFun.bind(this.worldMap);

        this.player = new Player(this);


        requestAnimationFrame(
            this.loop.bind(this),
            canvas
        )
    }





    render() {
        //ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.worldMap.render(gameRes);
        this.player.render(gameRes);
    }

    // 游戏逻辑更新主函数
    update() {
        this.player.pos = tileCollide.Move2(this.player.pos, this.player.dir, 1.2, this.mapAdj);
    }

    // 实现游戏帧循环
    loop() {
        this.frame++;
        if (this.frame >= 10) {
            this.update()
            this.render()
        }

        // // 游戏结束停止帧循环
        // if (databus.gameOver) {
        //     this.gameinfo.renderGameOver(ctx, databus.score)
        //     return
        // }

        requestAnimationFrame(
            this.loop.bind(this),
            canvas
        )
    }
}
