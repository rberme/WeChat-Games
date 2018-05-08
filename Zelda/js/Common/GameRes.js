
export const ResID = [
    /*1:*/ { typ: 0, x: 0, y: 0, width: 16, height: 16, frames: 0 },//图片
    /*2:*/ { typ: 0, x: 16, y: 0, width: 16, height: 16, frames: 1 },
    /*3:*/ { typ: 1, frames: [0, 1] },//动画
    /*4 */
    /*5 */
    /*6 */
    /*7 */
    /*8 */
    /*9 */
    /*10*/
    /*11*/
    /*12*/
]



let instance
export default class GameRes {
    constructor(ctx, screenWidth, screenHeight) {
        if (instance)
            return instance;
        instance = this;
        this.ctx = ctx;
        this.images = [];
        this.animFrameIdx = {};
        this.images[0] = wx.createImage();
        this.images[0].src = 'images/tileset.png';

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.renderRate = this.screenWidth / 112;
    }

    RenderTile(id, x, y,frame, anchorX = 0, anchorY = 0) {
        if (ResID[id] == 1) {//id instanceof Array) {
            this.renderAnim(id, x, y,frame, anchorX, anchorY);
            return;
        }
        this.renderImage(id, x, y, anchorX, anchorY);
    }

    renderAnim(idxes, x, y, frame, anchorX = 0, anchorY = 0) {
        curFrame = frame % ResID[idxes].frames.length;
        this.renderImage(curFrame, x, y, anchorX, anchorY);
    }

    renderImage(idx, x, y, anchorX = 0, anchorY = 0) {
        let tempWidth = ResID[idx].width;
        let tempHeight = ResID[idx].height;
        let drawX = (anchorX == 1 ? (x - tempWidth / 2) : (anchorX == 0 ? x : (x - tempWidth)));
        let drawY = (anchorY == 1 ? (y - tempHeight / 2) : (anchorY == 0 ? y : (y - tempHeight)));

        this.ctx.drawImage(
            this.images[0],
            ResID[idx].x,
            ResID[idx].y,
            tempWidth,
            tempHeight,
            drawX * this.renderRate,
            drawY * this.renderRate,
            tempWidth * this.renderRate,
            tempHeight * this.renderRate
        )
    }
    renderText(idx, x, y, size, data) {

        this.ctx.font = size + "px Arial"
        let str = "null";
        this.ctx.fillText(
            str,
            x,
            y)
    }

}