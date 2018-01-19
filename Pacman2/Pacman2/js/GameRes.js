

const altasRect = {
    0: [322, 2, 224, 248],      //背景框蓝色
    1: [480, 0, 224, 248],       //背景框白色
    2: [2, 192, 8, 8],//小点
    3: [2, 1, 16, 16],//pacman往左
    4:[200,0,52,12],//READY!
}
const y = 0.8 * 0.4
export const penRoutinePos = {//在围栏中来回移动的参考点
    1: [{//围栏中左边怪来回的点 (上下) 36-26->10  5+7->12
        x: 11.6,
        y: 14,
        dir: 1,
        dest: 13.375,
        speed: 0.48
    },
    {
        x: 11.6,
        y: 13.375,
        dir: 2,
        dest: 14.625,
        speed: 0.48
    },
    {
        x: 11.6,
        y: 14.625,
        dir: 1,
        dest: 14,
        speed: 0.48
    }],
    2: [{//围栏中中间怪来回的点 (上下)
        x: 13.5,
        y: 14,
        dir: 2,
        dest: 14.625,
        speed: 0.48
    },
    {
        x: 13.5,
        y: 14.625,
        dir: 1,
        dest: 13.375,
        speed: 0.48
    },
    {
        x: 13.5,
        y: 13.375,
        dir: 2,
        dest: 14,
        speed: 0.48
    }],
    3: [{//围栏中右边怪来回的点 (上下)
        x: 15.4,
        y: 14,
        dir: 1,
        dest: 13.375,
        speed: 0.48
    },
    {
        x: 15.4,
        y: 13.375,
        dir: 2,
        dest: 14.625,
        speed: 0.48
    },
    {
        x: 15.4,
        y: 14.625,
        dir: 1,
        dest: 14,
        speed: 0.48
    }],
    4: [{
        x: 11.6,
        y: 14,
        dir: 8,
        dest: 13.5,
        speed: y
    },
    {
        x: 13.5,
        y: 14,
        dir: 1,
        dest: 11,
        speed: y
    }],
    5: [{
        x: 13.5,
        y: 14,
        dir: 1,
        dest: 11,
        speed: y
    }],
    6: [{
        x: 15.4,
        y: 14,
        dir: 4,
        dest: 13.5,
        speed: y
    },
    {
        x: 13.5,
        y: 14,
        dir: 1,
        dest: 11,
        speed: y
    }],
    7: [{
        x: 13.5,
        y: 11,
        dir: 2,
        dest: 14,
        speed: 1.6
    },
    {
        x: 13.5,
        y: 14,
        dir: 4,
        dest: 11.625,
        speed: 1.6
    }],
    8: [{
        x: 13.5,
        y: 11,
        dir: 2,
        dest: 14,
        speed: 1.6
    }],
    9: [{
        x: 13.5,
        y: 11,
        dir: 2,
        dest: 14,
        speed: 1.6
    },
    {
        x: 13.5,
        y: 14,
        dir: 8,
        dest: 15.375,
        speed: 1.6
    }],
    10: [{
        x: 11.6,
        y: 14,
        dir: 8,
        dest: 13.5,
        speed: y
    },
    {
        x: 13.5,
        y: 14,
        dir: 1,
        dest: 11,
        speed: y
    }],
    11: [{
        x: 13.5,
        y: 14,
        dir: 1,
        dest: 11,
        speed: y
    }],
    12: [{
        x: 15.4,
        y: 14,
        dir: 4,
        dest: 13.5,
        speed: y
    },
    {
        x: 13.5,
        y: 14,
        dir: 1,
        dest: 11,
        speed: y
    }]
}
export const allDirection = [1, 4, 2, 8];//左,上,右,下
export const axisIncrement = {
    0: {
        axis: 0,
        increment: 0
    },
    1: {//上
        axis: 0,
        increment: -1
    },
    2: {//下
        axis: 0,
        increment: +1
    },
    4: {//左
        axis: 1,
        increment: -1
    },
    8: {//右
        axis: 1,
        increment: +1
    }
}

export const actorInitial = [//怪物的初始位置，方向，散开点
    {//玩家1的位置方向
        x: 13.5,
        y: 23,
        dir: 4
    },
    {//以下为4个怪物的数据
        x: 13.5,
        y: 11,
        dir: 4,
        scatterX: 25,
        scatterY: -3
    },
    {
        x: 13.5,
        y: 14,
        dir: 2,
        scatterX: 2,
        scatterY: -3
    },
    {
        x: 11.625,
        y: 14,
        dir: 1,
        scatterX: 27,
        scatterY: 32
    },
    {
        x: 15.375,
        y: 14,
        dir: 1,
        scatterX: 0,
        scatterY: 32
    }
]//一个玩家时
//...

export const penExit = [88,104];//围栏的出口
export const fruitPos = [136,104];//水果的位置
export const tunneLadit = [//隧道口
    {
        x: 0,
        y: 14
    },
    {
        x: 28,
        y: 14
    }]

export const allPaths = [
    {
        x: 1,
        y: 1,
        w: 12
    },

    {
        x: 15,
        y: 1,
        w: 12
    },

    {
        x: 1,
        y: 29,
        w: 26
    },

    {
        x: 1,
        y: 5,
        w: 26
    },

    {
        x: 1,
        y: 8,
        w: 6
    },

    {
        x: 9,
        y: 8,
        w: 4
    },

    {
        x: 9,
        y: 11,
        w: 10
    },
    {
        x: 9,
        y: 17,
        w: 10
    },
    {
        x: 6,
        y: 23,
        w: 16
    },

    {
        x: 21,
        y: 8,
        w: 6
    },
    {
        x: 15,
        y: 8,
        w: 4
    },
    {
        x: 0,
        y: 14,
        w: 10
    },
    {
        x: 18,
        y: 14,
        w: 10
    },

    {
        x: 1,
        y: 20,
        w: 12
    },
    {
        x: 15,
        y: 20,
        w: 12
    },
    {
        x: 1,
        y: 23,
        w: 3
    },
    {
        x: 24,
        y: 23,
        w: 3
    },
    {
        x: 21,
        y: 26,
        w: 6
    },
    {
        x: 1,
        y: 26,
        w: 6
    },
    {
        x: 9,
        y: 26,
        w: 4
    },
    {
        x: 15,
        y: 26,
        w: 4
    },
    {
        x: 21,
        y: 1,
        h: 26
    },
    {
        x: 1,
        y: 1,
        h: 8
    },
    {
        x: 6,
        y: 1,
        h: 26
    },
    {
        x: 9,
        y: 5,
        h: 4
    },
    {
        x: 1,
        y: 20,
        h: 4
    },
    {
        x: 1,
        y: 26,
        h: 4
    },
    {
        x: 26,
        y: 1,
        h: 8
    },
    {
        x: 15,
        y: 1,
        h: 5
    },
    {
        x: 12,
        y: 1,
        h: 5
    },
    {
        x: 18,
        y: 11,
        h: 10
    },
    {
        x: 12,
        y: 8,
        h: 4
    },
    {
        x: 3,
        y: 23,
        h: 4
    },
    {
        x: 24,
        y: 23,
        h: 4
    },
    {
        x: 9,
        y: 23,
        h: 4
    },
    {
        x: 18,
        y: 23,
        h: 4
    },
    {
        x: 9,
        y: 11,
        h: 10
    },
    {
        x: 15,
        y: 8,
        h: 4
    },
    {
        x: 18,
        y: 5,
        h: 4
    },
    {
        x: 26,
        y: 20,
        h: 4
    },
    {
        x: 26,
        y: 26,
        h: 4
    },
    {
        x: 15,
        y: 20,
        h: 4
    },
    {
        x: 12,
        y: 20,
        h: 4
    },
    {
        x: 12,
        y: 26,
        h: 4
    },
    {
        x: 15,
        y: 26,
        h: 4
    },
]

export const noDotPaths = [
    {
        x: 9,
        y: 11,
        w: 10
    },
    {
        x: 9,
        y: 12,
        h: 8
    },
    {
        x: 10,
        y: 17,
        w: 8
    },
    {
        x: 18,
        y: 12,
        h: 8
    },
    {
        x: 12,
        y: 9,
        h: 2
    },
    {
        x: 15,
        y: 9,
        h: 2
    },
    {
        x: 7,
        y: 14,
        w: 2
    },
    {
        x: 0,
        y: 14,
        w: 6
    },
    {
        x: 19,
        y: 14,
        w: 2
    },
    {
        x: 22,
        y: 14,
        w: 6
    },
    {
        x: 13,
        y: 23,
        w: 2
    },
]

export const actorMode = {
    RESET: 0b00000010,
    WAIT: 0b00010000,
    EXITINGPEN: 0b00100000,
}

export const gameMode = {
    READY:4,
    DEDUCTLIVE:5,
}

export const levelConfig = [{},//关卡配置数据
{
    ghostSpeed: 0.75,
    ghostTunnelSpeed: 0.4,
    playerSpeed: 0.8,
    dotEatingSpeed: 0.71,
    ghostFrightSpeed: 0.5,
    playerFrightSpeed: 0.9,
    dotEatingFrightSpeed: 0.79,
    elroyDotsLeftPart1: 20,
    elroySpeedPart1: 0.8,
    elroyDotsLeftPart2: 10,
    elroySpeedPart2: 0.85,
    frightTime: 6,
    frightBlinkCount: 5,
    fruit: 1,
    fruitScore: 100,
    ghostModeSwitchTimes: [7, 20, 7, 20, 5, 20, 5, 1],
    penForceTime: 4,
    penLeavingLimits: [0, 0, 30, 60]
},
]

export const oppositeDirections = {
    1: 2,
    2: 1,
    4: 8,
    8: 4
}

export const times = {//倒计时时间 秒
    0: 0.16,
    1: 0.23,
    2: 1,
    3: 1,
    4: 2.23,
    5: 0.3,
    6: 1.9,
    7: 2.23,
    8: 1.9,
    9: 5,
    10: 1.9,
    11: 1.18,
    12: 0.3,
    13: 0.5,
    14: 1.9,
    15: 9,
    16: 10,
    17: 0.26
}

let instance
export default class GameRes {
    constructor(ctx, screenWidth, screenHeight) {
        if (instance)
            return instance;
        instance = this;
        this.ctx = ctx;
        this.image = wx.createImage();
        this.image.src = 'images/pacmanaltas.png';

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.renderRate = this.screenWidth / 224;
    }

    renderImage(idx, x, y, anchorX = 0, anchorY = 0) {
        // if (idx == 2) {//画点
        //     let w = 2 * this.renderRate;
        //     let h = w;
        //     this.ctx.fillRect(x - w / 2, y - h / 2, w, h);
        //     return;
        // }
        let tempWidth = altasRect[idx][2];
        let tempHeight = altasRect[idx][3];
        let drawX = anchorX == 1 ? x - tempWidth / 2 : (anchorX == 0 ? x : x - tempWidth);
        let drawY = anchorY == 1 ? y - tempHeight / 2 : (anchorX == 0 ? y : y - tempHeight);


        this.ctx.drawImage(
            this.image,
            altasRect[idx][0],
            altasRect[idx][1],
            tempWidth,
            tempHeight,
            drawX * this.renderRate,
            drawY * this.renderRate,
            tempWidth * this.renderRate,
            tempHeight * this.renderRate
        )
    }

}