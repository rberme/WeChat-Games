

let instance
export default class GameRes {
    constructor(ctx, screenWidth, screenHeight) {
        if (instance)
            return instance;
        // instance = this;
        // this.ctx = ctx;
        // this.image = wx.createImage();
        // this.image.src = 'images/pacmanaltas.png';

        // this.screenWidth = screenWidth;
        // this.screenHeight = screenHeight;
        // this.renderRate = this.screenWidth / 224;
    }

    renderImage(idx, x, y, anchorX = 0, anchorY = 0) {
        // let tempWidth = ALTASRECT[idx][2];
        // let tempHeight = ALTASRECT[idx][3];
        // let drawX = anchorX == 1 ? x - tempWidth / 2 : (anchorX == 0 ? x : x - tempWidth);
        // let drawY = anchorY == 1 ? y - tempHeight / 2 : (anchorX == 0 ? y : y - tempHeight);


        // this.ctx.drawImage(
        //     this.image,
        //     ALTASRECT[idx][0],
        //     ALTASRECT[idx][1],
        //     tempWidth,
        //     tempHeight,
        //     drawX * this.renderRate,
        //     drawY * this.renderRate,
        //     tempWidth * this.renderRate,
        //     tempHeight * this.renderRate
        // )
    }
}