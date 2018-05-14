import World from "./World"
import GameRes from "./GameRes"
import Utils from "./Utils"

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0

        wx.onTouchStart(this.onTouchStartEventHandler.bind(this));
        wx.onTouchMove(this.onTouchMoveEventHandler.bind(this));
        wx.onTouchEnd(this.onTouchEndEventHandler.bind(this));
        wx.onTouchCancel(this.onTouchCancelEventHandler.bind(this));

        this.world = new World();
        this.restart()
    }

    onTouchStartEventHandler(e) {
        //e.type == PlatformDifference[this.platform].touchstart
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY
        this.touchMode = 0;

    }

    onTouchMoveEventHandler(e) {
        if (this.touchMode == 0) {
            this.touchMode = 2;
            //this.joyStick.StartCapture(e.touches[0].clientX, e.touches[0].clientY);
            this.joyStick.SetPosition(e.touches[0].clientX, e.touches[0].clientY)
        }
        //this.joyStick.KeepCapture(e.touches[0].clientX, e.touches[0].clientY);
        this.joyStick.SetHandlePosition(e.touches[0].clientX, e.touches[0].clientY)
    }

    onTouchEndEventHandler(e) {
        if (this.touchMode == 0) {
            //点击(未滑动)
        }
        this.touchMode = 0;
        //this.joyStick.StopCapture();

    }

    onTouchCancelEventHandler(e) {
        this.onTouchEndEventHandler(e);
    }

    
    restart() {

        this.bindLoop = this.loop.bind(this)

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
        this.world.Draw(gameRes);
    }

    // 游戏逻辑更新主函数
    update() {
        this.world.Update();
    }

    // 实现游戏帧循环
    loop() {
        this.frame++

        this.update()
        this.render()

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
