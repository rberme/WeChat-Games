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
        this.updateCmdBuff = [];

        wx.connectSocket({
            url: "ws://192.168.0.189:8338/ws",
        })
        wx.onSocketMessage(this.OnSocketMessage.bind(this))
        wx.onSocketError(function (res) {
            console.log('websocket fail');
        })

        wx.onSocketOpen(this.OnSocketOpen.bind(this))

        //this.Init();
    }


    OnSocketMessage(res) {
        // if (res.data != "[123]")
        //     console.log(JSON.parse(res.data));
        if (res.data != null) {
            this.updateCmdBuff.push(JSON.parse(res.data));
        }

    }

    OnSocketOpen(res) {
        console.log('websocket success');
        this.Init();
    }


    Init() {
        this.touchTarget = [-1, -1, -1, -1, -1];
        this.touchPlanets = [[], [], [], [], [],]
        this.touchCurrPoses = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        wx.onTouchStart(this.onTouchStartEventHandler.bind(this));
        wx.onTouchMove(this.onTouchMoveEventHandler.bind(this));
        wx.onTouchEnd(this.onTouchEndEventHandler.bind(this));
        wx.onTouchCancel(this.onTouchCancelEventHandler.bind(this));

        this.updateFrame = 0;
        this.world = new World(canvas.width, canvas.height);
        this.restart()

        this.userId = 1;
        this.world.CreatePlanets(0, [{ id: 1, color: "blue" }, { id: 2, color: "red" }]);
    }



    onTouchStartEventHandler(e) {
        //e.type == PlatformDifference[this.platform].touchstart

        this.touchCurrPoses[0][0] = e.touches[0].clientX << Utils.MULTI
        this.touchCurrPoses[0][1] = e.touches[0].clientY << Utils.MULTI

        let temp = this.world.ConvertToPlanetPos(this.userId, this.touchCurrPoses[0]);
        if (temp >= 0 && temp < 100) {
            let pList = this.touchPlanets[0];
            pList[pList.length] = temp;
        }
        this.touchTarget[0] = -1;
    }

    onTouchMoveEventHandler(e) {
        // if (this.touchPoses[0] >= 0) {
        //     this.touchCurrPoses[0][0] = e.touches[0].clientX << Utils.MULTI
        //     this.touchCurrPoses[0][1] = e.touches[0].clientY << Utils.MULTI

        //     let temp = this.world.ConvertToPlanetPos(this.userId, this.touchCurrPoses[0]);
        //     if (temp >= 0 && temp < 100) {//连接自己的星球

        //     }
        //     return;
        //     if (temp >= 0 && temp != this.touchPoses[0]) {
        //         this.touchCurrPoses[0][0] = -1;
        //         this.touchCurrPoses[0][1] = temp;
        //     }
        // }
        this.touchCurrPoses[0][0] = e.touches[0].clientX << Utils.MULTI
        this.touchCurrPoses[0][1] = e.touches[0].clientY << Utils.MULTI

        let pList = this.touchPlanets[0];
        if (pList.length > 0) {
            let temp = this.world.ConvertToPlanetPos(this.userId, this.touchCurrPoses[0]);

            if (temp > 100)
                this.touchTarget[0] = temp - 100
            else this.touchTarget[0] = temp;

            if (temp >= 0 && temp < 100) {//连接自己的星球
                for (let i = 0; i < pList.length; i++) {
                    if (pList[i] == temp) {
                        return;
                    }
                }
                if (pList.length < 5)
                    pList[pList.length] = temp;
            }
        }
    }

    onTouchEndEventHandler(e) {
        let pList = this.touchPlanets[0];
        if (pList.length > 0 && this.touchTarget[0] >= 0) {
            let cmd = "[";
            for (let i = 0; i < pList.length; i++) {
                if (pList[i] == this.touchTarget[0])
                    continue;
                cmd += pList[i] + ",";
            }
            cmd += this.touchTarget[0] + "]";
            console.log("发送:" + cmd);
            wx.sendSocketMessage({
                data: cmd,
            })
        }
        this.touchPlanets[0] = [];
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


        // for (let i = 0; i < this.touchPoses.length; ++i) {
        //     if (this.touchPoses[i] >= 0) {
        //         gameRes.DrawLine(this.world.planets[this.touchPoses[i]].center,
        //             this.touchCurrPoses[i][0] < 0 ? this.world.planets[this.touchCurrPoses[i][1]].center : this.touchCurrPoses[i]);
        //     }
        // }
        let pList = this.touchPlanets[0];
        if (pList.length > 0) {
            //console.log(pList)
            let targetPos = this.touchTarget[0] < 0 ? this.touchCurrPoses[0] : this.world.planets[this.touchTarget[0]].center;
            for (let i = 0; i < pList.length; i++) {
                if (pList[i] == this.touchTarget[0])
                    continue;
                gameRes.DrawLine(this.world.planets[pList[i]].center, targetPos);
            }
        }

    }

    // 游戏逻辑更新主函数
    update(frame, frameData) {

        this.world.Update(frame, frameData);
    }

    // 实现游戏帧循环
    loop() {
        let frameData = this.updateCmdBuff.shift();
        if (frameData != null) {// && this.frame < 80)
            this.updateFrame++
            this.update(4, frameData)
        }

        this.render()

        this.aniId = requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
