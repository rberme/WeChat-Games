

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        this.bannerAd = wx.createBannerAd({
            adUnitId:"",
            style:{
                left:0,
                top:0,
                width:300,
                height:100,
            }
        });
        this.bannerAd.show();
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

        
    }

    // 游戏逻辑更新主函数
    update() {
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
