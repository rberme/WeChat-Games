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

        // wx.connectSocket({
        //     url: "ws://192.168.0.189:8338/ws",
        //     header: {
        //         // "Access-Control-Allow-Origin": "*",
        //         // "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        //         // "Access-Control-Allow-Headers": "*",
        //         "Origin": "http://192.168.0.189:8338"
        //     }
        // })
        // wx.onSocketMessage(this.loop.bind(this))
        // wx.onSocketError(function (res) {
        //     console.log('websocket fail');
        // })

        // wx.onSocketOpen(this.OnSocketOpen.bind(this))

        this.Init();
    }



    OnSocketOpen(res) {
        console.log('websocket success');
        this.Init();
    }

    OnSocketMessage(res) {

    }

    Init() {
        wx.onTouchStart(this.onTouchStartEventHandler.bind(this));
        wx.onTouchMove(this.onTouchMoveEventHandler.bind(this));
        wx.onTouchEnd(this.onTouchEndEventHandler.bind(this));
        wx.onTouchCancel(this.onTouchCancelEventHandler.bind(this));

        this.frame = 0;
        this.world = new World();
        this.restart()

    }

    onTouchStartEventHandler(e) {
        //e.type == PlatformDifference[this.platform].touchstart
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY

        this.world.MoveStart(this.touchStartX, this.touchStartY);
    }

    onTouchMoveEventHandler(e) {
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY
        this.world.Moving(this.touchStartX, this.touchStartY);
    }

    onTouchEndEventHandler(e) {
        this.world.MoveOne();
        // if (this.world.startIdx >= 0 && this.world.endIdx >= 0) {
        //     wx.sendSocketMessage({
        //         data: this.world.startIdx + "," + this.world.endIdx,
        //     })
        // }
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
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        this.world.Draw(gameRes);
    }

    // 游戏逻辑更新主函数
    update(frame) {
        this.world.Update(frame);
    }

    // 实现游戏帧循环
    loop() {
        // if (res.data.length > 1) {
        //     console.log(res.data);
        //     this.world.startIdx = parseInt(res.data[0]);
        //     this.world.endIdx = parseInt(res.data[2]);
        //     this.world.MoveOne();
        // }
        this.frame++
        if (this.frame % 4 == 0)
            this.update(4)
        this.render()

        this.aniId = requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
