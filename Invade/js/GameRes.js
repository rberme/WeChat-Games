import Utils from "./Utils"


let instance
export default class GameRes {
    constructor(ctx, screenWidth, screenHeight) {
        if (instance)
            return instance;
        instance = this;
        this.ctx = ctx;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.renderRate = this.screenWidth / 112;
        this.CamX = this.CamY = 0;
    }



    RenderText(str, x, y, size) {
        x = (x - this.CamX) / Utils.MULTI;
        y = (y - this.CamY) / Utils.MULTI;

        this.ctx.font = size + "px Arial"
        this.ctx.fillText(
            str,
            x,
            y)
    }

    DrawCircle(center, radius, color = "gray") {
        this.ctx.fillStyle = color;

        var startAngleInRadians = 0;
        var endAngleInRadians = 2 * Math.PI;

        this.ctx.beginPath();
        this.ctx.arc(center[0] / Utils.MULTI, center[1] / Utils.MULTI, radius / Utils.MULTI, startAngleInRadians, endAngleInRadians);

        this.ctx.stroke();
        this.ctx.fill();
    }

    DrawLine(start, end,color = "gray") {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(start[0] / Utils.MULTI, start[1] / Utils.MULTI);
        this.ctx.lineTo(end[0] / Utils.MULTI, end[1] / Utils.MULTI);
        this.ctx.stroke();
        //this.ctx.endPath();
    }

}