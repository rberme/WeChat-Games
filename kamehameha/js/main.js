import GameRes from "./GameRes"
import Utils from "./Utils"
import World from "./World"
//import test from "./test"


let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);

const tempArr = [];
tempArr["abc"] = function () {
    console.log("abc");
}
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

        this.restart()
    }


    onTouchStartEventHandler(e) {
        this.world.TouchStart(e.touches[0].clientX, e.touches[0].clientY)
    }

    onTouchMoveEventHandler(e) {
        this.world.TouchMove(e.touches[0].clientX, e.touches[0].clientY)

        // e.touches[0].clientX
        // e.touches[0].clientY


        // let lightDir = [e.touches[0].clientX - this.testLine.start[0], e.touches[0].clientY - this.testLine.start[1]]
        // let len = this.test(this.testLine.start,
        //     lightDir,
        //     this.testBall.center,
        //     this.testBall.radius);

        // let result1 = (2 * lenLC + sqrt_b2_4ac) / (2 * (1 + tanθ2))
        // if (result1 > 0 && result1 < lenLC) {
        //     this.testLine.end[0] = lightSrc[0] + lightDir[0] * result1;
        //     this.testLine.end[1] = lightSrc[1] + lightDir[1] * result1;
        //     return;
        // }

        // this.testLine.end[0] = this.testLine.start[0] + lightDir[0] * len;
        // this.testLine.end[1] = this.testLine.start[1] + lightDir[1] * len;
    }

    onTouchEndEventHandler(e) {
        this.world.TouchEnd()

        //test(lightSrc, lightDir, center, radius)
        // this.test(this.testLine.start,
        //     [this.testLine.end[0] - this.testLine.start[0], this.testLine.end[1] - this.testLine.start[1]],
        //     this.testBall.center,
        //     this.testBall.radius);
    }

    onTouchCancelEventHandler(e) {
        this.onTouchEndEventHandler(e);
    }

    restart() {

        this.world = new World();
        this.world.Init();

        this.bindLoop = this.loop.bind(this)

        // 清除上一局的动画
        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(
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
        this.world.Render(gameRes);
    }

    // 游戏逻辑更新主函数
    update() {
        this.world.Update();
    }





    // 实现游戏帧循环
    loop() {
        //databus.frame++

        this.update()
        this.render()

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }






    test(lightSrc, lightDir, center, radius) {
        Utils.Normalize(lightDir);
        let light2center = [center[0] - lightSrc[0], center[1] - lightSrc[1]]
        let lenLC = Utils.Normalize(light2center);

        let sideLen = lightDir[0] * light2center[0] + lightDir[1] * light2center[1];
        let sideLen2 = sideLen * sideLen;
        let tanθ2 = (1 - sideLen2) / sideLen2;

        let lenLC2 = lenLC * lenLC;
        let b2_4ac = 4 * lenLC2 - 4 * (1 + tanθ2) * (lenLC2 - radius * radius);
        let result2 = 500;
        if (b2_4ac > 0) {
            let sqrt_b2_4ac = Utils.Q_Sqrt(b2_4ac)//Math.sqrt(b2_4ac)//
            result2 = (2 * lenLC - sqrt_b2_4ac) / (2 * (1 + tanθ2))
            result2 = Utils.Q_Sqrt(result2 * result2 * (1 + tanθ2));
        }
        return result2;
    }
}
