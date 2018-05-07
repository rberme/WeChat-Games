

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0

        this.restart()
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
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 50, canvas.width, canvas.width/9*11);
    }

    // 游戏逻辑更新主函数
    update() {
    }

    // 实现游戏帧循环
    loop() {

        this.update()
        this.render()

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
