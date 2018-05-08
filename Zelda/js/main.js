import GameRes from "./Common/GameRes"
import Map from "./Map/Map"

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);
//let fileSystemMgr = wx.getFileSystemManager();
/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0
        this.restart()
        this.disableAntiAliasing(ctx);
    }
    disableAntiAliasing(context) {
        // note: you must factor this into any other context.translate calls in the future
        //context.translate(0.5, 0.5);
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
    }
    restart() {
        this.frames = 0
        this.bindLoop = this.loop.bind(this)

        this.currMap = new Map(0,2,2);
        // 清除上一局的动画
        cancelAnimationFrame(this.aniId);

        this.aniId = requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }


    /**
     * canvas重绘函数
     * 每一帧重新绘制所有的需要展示的元素
     */
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 50, canvas.width, canvas.width/7*9);
        gameRes.renderText(0,0,0,10,null);
        this.currMap.DrawGround(gameRes,this.frames);
    }

    // 游戏逻辑更新主函数
    update() {
        this.frames++;


    }

    // 实现游戏帧循环
    loop() {

        this.update()
        this.render()

        this.aniId = requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
