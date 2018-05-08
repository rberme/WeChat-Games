
export const ResID = [
    /*0:*/ {},//{typ:1,frames[1,2,3]}//动画格式
    /*1:*/ { typ: 0, x: 0, y: 0, width: 16, height: 16, coll: 0b1111 },//带树根的树
    /*2:*/ { typ: 0, x: 16, y: 0, width: 16, height: 16, coll: 0 },//没有树根的树
    /*3:*/ { typ: 0, x: 32, y: 0, width: 16, height: 16, coll: 0 },//纯绿地
    /*4 */ { typ: 0, x: 48, y: 0, width: 16, height: 16, coll: 0 },//残瓷砖
    /*5 */ { typ: 0, x: 64, y: 0, width: 16, height: 16, coll: 0 },//整瓷砖 左
    /*6 */ { typ: 0, x: 0, y: 16, width: 16, height: 16, coll: 0b1111 },//河左上角
    /*7 */ { typ: 0, x: 16, y: 16, width: 16, height: 16, coll: 0b1111 },//细河道 上下
    /*8 */ { typ: 0, x: 32, y: 16, width: 16, height: 16, coll: 0b1111 },//河中
    /*9 */ { typ: 0, x: 48, y: 16, width: 16, height: 16, coll: 0 },//元素地基
    /*10*/ { typ: 0, x: 64, y: 16, width: 16, height: 16, coll: 0 },//整瓷砖 右
    /*11*/ { typ: 0, x: 0, y: 32, width: 16, height: 16, coll: 0 },//主角地基
    /*12*/ { typ: 0, x: 16, y: 32, width: 48, height: 16, coll: 0 },//祭坛上方 (牛角)
    /*13*/ { typ: 0, x: 0, y: 48, width: 80, height: 16, coll: [0b0110,0b1111,0b1111,0b1111,0b0011] },//祭坛中间
    /*14*/ { typ: 0, x: 0, y: 64, width: 80, height: 16, coll: [0b1100,0b1111,0b1111,0b1111,0b1001] },//祭坛底边
    /*15*/
    /*16*/
    /*17*/
    /*18*/
    /*19*/
    /*20*/
    /*21*/
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

    RenderTile(id, x, y, frame, anchorX = 0, anchorY = 0) {
        if (ResID[id] == 1) {//id instanceof Array) {
            this.renderAnim(id, x, y, frame, anchorX, anchorY);
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