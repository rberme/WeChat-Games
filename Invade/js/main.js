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
        this.touchPoses = [-1, -1, -1, -1, -1];
        //this.touchValid = [false, false, false, false, false]
        this.touchCurrPoses = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        wx.onTouchStart(this.onTouchStartEventHandler.bind(this));
        wx.onTouchMove(this.onTouchMoveEventHandler.bind(this));
        wx.onTouchEnd(this.onTouchEndEventHandler.bind(this));
        wx.onTouchCancel(this.onTouchCancelEventHandler.bind(this));

        this.frame = 0;
        this.world = new World(canvas.width, canvas.height);
        this.restart()


        this.world.CreatePlanets(0, [{ id: 1, color: "blue" }]);
    }



    onTouchStartEventHandler(e) {
        //e.type == PlatformDifference[this.platform].touchstart

        let x = e.touches[0].clientX << Utils.MULTI
        let y = e.touches[0].clientY << Utils.MULTI
        this.touchCurrPoses[0][0] = x;
        this.touchCurrPoses[0][1] = y;

        this.touchPoses[0] = this.world.ConvertToPlanetPos(1, [x, y]);
        //this.startIdx = this.world.MoveStart(this.touchPoses[0]);
    }

    onTouchMoveEventHandler(e) {
        if (this.touchPoses[0] >= 0) {
            this.touchCurrPoses[0][0] = e.touches[0].clientX << Utils.MULTI
            this.touchCurrPoses[0][1] = e.touches[0].clientY << Utils.MULTI

            let temp = this.world.ConvertToPlanetPos(-1, this.touchCurrPoses[0]);
            if (temp >= 0 && temp != this.touchPoses[0]) {
                this.touchCurrPoses[0][0] = -1;
                this.touchCurrPoses[0][1] = temp;
            }
        }
    }

    onTouchEndEventHandler(e) {

        this.touchPoses[0] = -1;



        //this.startIdx = -1;
        //this.world.MoveOne();
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

        // if (this.startIdx >= 0) {
        //     let fingerPos = [this.touchPoses[0][0] << Utils.MULTI, this.touchPoses[0][1] << Utils.MULTI];
        //     gameRes.DrawLine(this.world.planets[this.startIdx].center, this.endIdx >= 0 ? this.world.planets[this.endIdx].center : fingerPos);
        // }


        for (let i = 0; i < this.touchPoses.length; ++i) {
            if (this.touchPoses[i] >= 0) {
                gameRes.DrawLine(this.world.planets[this.touchPoses[i]].center,
                    this.touchCurrPoses[i][0] < 0 ? this.world.planets[this.touchCurrPoses[i][1]].center : this.touchCurrPoses[i]);
            }
        }
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
