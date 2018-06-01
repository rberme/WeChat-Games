import Utils from "./Utils"

const OWidth = 514;

let instance
export default class GameRes {
    constructor(ctx, screenWidth, screenHeight) {
        if (instance)
            return instance;
        instance = this;
        this.ctx = ctx;

        this.images = [];
        this.images[0] = wx.createImage();
        this.images[0].src = 'images/O.png';

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.renderRate = this.screenWidth / 112;
        this.CamX = this.CamY = 0;
    }

    RenderText(str, pos, size, color) {
        let x = (pos[0] - this.CamX) / Utils.MULTIV;
        let y = (pos[1] - this.CamY) / Utils.MULTIV;

        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillStyle = color;
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
        this.ctx.arc(center[0] / Utils.MULTIV, center[1] / Utils.MULTIV, radius / Utils.MULTIV, startAngleInRadians, endAngleInRadians);

        this.ctx.stroke();
        this.ctx.fill();
        // this.ctx.drawImage(
        //     this.images[0],
        //     (center[0] - radius) / Utils.MULTIV,
        //     (center[1] - radius) / Utils.MULTIV,
        //     (radius * 2) / Utils.MULTIV,
        //     (radius * 2) / Utils.MULTIV
        // )
    }

    DrawLine(start, end, color = "gray") {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(start[0] / Utils.MULTIV, start[1] / Utils.MULTIV);
        this.ctx.lineTo(end[0] / Utils.MULTIV, end[1] / Utils.MULTIV);
        this.ctx.stroke();
        //this.ctx.endPath();
    }

    DrawRect(rect, color = "red") {
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(
            rect[0] / Utils.MULTIV,
            rect[1] / Utils.MULTIV,
            rect[2] / Utils.MULTIV,
            rect[3] / Utils.MULTIV
        )
    }



}