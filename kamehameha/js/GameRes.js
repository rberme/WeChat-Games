

const OWidth = 514;

let instance
export default class GameRes {
    constructor(ctx, screenWidth, screenHeight) {
        if (instance)
            return instance;
        instance = this;
        this.ctx = ctx;

        // this.images = [];
        // this.images[0] = wx.createImage();
        // this.images[0].src = 'images/O.png';

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.renderRate = this.screenWidth / 112;
        this.CamX = this.CamY = 0;
    }

    RenderText(str, pos, size, color) {
        let x = (pos[0] - this.CamX);
        let y = (pos[1] - this.CamY);

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
        this.ctx.arc(center[0], center[1], radius, startAngleInRadians, endAngleInRadians);

        this.ctx.stroke();
        this.ctx.fill();
    }

    DrawLine(start, end, color = "gray") {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(end[0], end[1]);
        this.ctx.stroke();
        //this.ctx.endPath();
    }

    DrawRect(rect, color = "red") {
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(
            rect[0],
            rect[1],
            rect[2],
            rect[3]
        )
    }


    DrawArc(center, radius, dir, color = "gray") {

        this.ctx.fillStyle = color;

        var startAngleInRadians = 0;
        var endAngleInRadians = Math.PI;


        this.ctx.beginPath();
        this.ctx.arc(center[0], center[1], radius, startAngleInRadians, endAngleInRadians);

        this.ctx.stroke();
        this.ctx.fill();
    }


    DrawPolygon(center, points, color, typ) {
        this.ctx.beginPath();
        this.ctx.moveTo(center[0] + points[0][0], center[1] + points[0][1]);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(center[0] + points[i][0], center[1] + points[i][1]);
        }
        this.ctx[typ + 'Style'] = color;
        this.ctx.closePath();
        this.ctx[typ]();
    }
}