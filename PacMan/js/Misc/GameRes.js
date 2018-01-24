
const ALTASRECT = {
    0: [322, 2, 224, 248],      //背景框蓝色
    1: [546, 0, 224, 248],       //背景框白色
    2: [2, 192, 8, 8],//小点
    3: [2, 1, 16, 16],//pacman往左
    4: [200, 0, 52, 12],//READY!
    5: [22, 1, 16, 16],//pacman 往左2
    6: [42, 1, 16, 16],//pacman合嘴
    7: [2, 21, 16, 16],//pacman往右
    8: [22, 21, 16, 16],//pacman往右2
    9: [2, 41, 16, 16],//pacman往上
    10: [22, 41, 16, 16],//pacman往上2
    11: [2, 182, 8, 8],//大点
    12: [2, 61, 16, 16],//pacman往下
    13: [22, 61, 16, 16],//pacman往下2

    14: [2, 81, 16, 16],//red上1
    15: [22, 81, 16, 16],//red上2
    16: [42, 81, 16, 16],//red下1
    17: [62, 81, 16, 16],//red下2
    18: [82, 81, 16, 16],//red左1
    19: [102, 81, 16, 16],//red左2
    20: [122, 81, 16, 16],//red右1
    21: [142, 81, 16, 16],//red右2

    22: [2, 101, 16, 16],//pink上1
    23: [22, 101, 16, 16],//pink上2
    24: [42, 101, 16, 16],//pink下1
    25: [62, 101, 16, 16],//pink下2
    26: [82, 101, 16, 16],//pink左1
    27: [102, 101, 16, 16],//pink左2
    28: [122, 101, 16, 16],//pink右1
    29: [142, 101, 16, 16],//pink右2

    30: [2, 121, 16, 16],//blue上1
    31: [22, 121, 16, 16],//blue上2
    32: [42, 121, 16, 16],//blue下1
    33: [62, 121, 16, 16],//blue下2
    34: [82, 121, 16, 16],//blue左1
    35: [102, 121, 16, 16],//blue左2
    36: [122, 121, 16, 16],//blue右1
    37: [142, 121, 16, 16],//blue右2

    38: [2, 141, 16, 16],//yellow上1
    39: [22, 141, 16, 16],//yellow上2
    40: [42, 141, 16, 16],//yellow下1
    41: [62, 141, 16, 16],//yellow下2
    42: [82, 141, 16, 16],//yellow左1
    43: [102, 141, 16, 16],//yellow左2
    44: [122, 141, 16, 16],//yellow右1
    45: [142, 141, 16, 16],//yellow右2

    46: [170, 164, 16, 16],//樱桃
    //47
    //48
    //49

    50: [2, 161, 16, 16],//ghost受惊blue1
    51: [22, 161, 16, 16],//ghost受惊blue2
    52: [42, 161, 16, 16],//ghost受惊white1
    53: [62, 161, 16, 16],//ghost受惊white2

    54: [280, 0, 36, 36],//pacman big 右1
    55: [280, 40, 36, 36],//pacman big 右2
    56: [280, 80, 36, 36],//pacman big 右3

    57: [2, 260, 16, 16],//stick1
    58: [22, 260, 16, 16],//stick2
    59: [42, 260, 16, 16],//stick3
    60: [62, 260, 16, 16],//stick4
    61: [82, 260, 16, 16],//stick5

    62: [122, 220, 16, 16],//
    63: [142, 220, 16, 16],

    64: [122, 161, 16, 16],//Red右1 缝补
    65: [142, 161, 16, 16],//red右2 缝补

    66: [122, 181, 32, 16],//虫子1
    67: [122, 201, 32, 16],//虫子2

    68: [2, 201, 16, 16],//眼睛上
    69: [22, 201, 16, 16],//眼睛下
    70: [42, 201, 16, 16],//眼睛左
    71: [62, 201, 16, 16],//眼睛右

    72: [42, 1, 16, 16],//player die
    73: [2, 238, 16, 20],//player die
    74: [22, 238, 16, 20],//player die
    75: [42, 238, 16, 20],//player die
    76: [62, 238, 16, 20],//player die
    77: [82, 238, 16, 20],//player die
    78: [102, 238, 16, 20],//player die
    79: [122, 238, 16, 20],//player die
    80: [142, 238, 16, 20],//player die
    81: [162, 238, 16, 20],//player die
    82: [182, 238, 16, 20],//player die
    83: [202, 238, 16, 20],//player die
    84: [222, 238, 16, 20],//player die



    85: [8, 192, 85, 8],//GAME OVER

    86: [170, 184, 16, 16],//草莓
    87: [170, 204, 16, 16],//橘子
    88: [170, 224, 16, 16],//苹果

    89: [210, 164, 16, 16],//葡萄
    90: [210, 184, 16, 16],//冰淇淋
    91: [210, 204, 16, 16],//
    92: [210, 224, 16, 16],//钥匙

    93: [2, 221, 16, 16],//200
    94: [22, 221, 16, 16],//400
    95: [42, 221, 16, 16],//800
    96: [62, 221, 16, 16],//1600

    100: [256, 128, 64, 64],//insert coin

}

export const PM_DIRECTION = {
    NONE:0,
    UP:1,
    DOWN:2,
    LEFT:4,
    RIGHT:8
}
export const BLOCKSIZE = 8;
export const ACTORINITIAL = [//怪物的初始位置，方向，散开点
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
export const ENERGIZER = [
    {
        x: 1,
        y: 3
    },
    {
        x: 1,
        y: 23
    },
    {
        x: 26,
        y: 3
    },
    {
        x: 26,
        y: 23
    }
]
export const ALLPATHS = [
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

export const NODOTPATHS = [
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
export const ACTORMODE = {
    NONE: 0,
    CHASE: 1,
    SCATTER: 0b00000010,
    FRIGHTENED: 0b00000100,//4
    EATEN: 8,
    IN_PEN: 16,
    LEAVING_PEN: 0b00100000,//32
    ENTERING_PEN: 64,
    RE_LEAVING_FROM_PEN: 128,
}

export const GAMEMODE = {
    ORDINARY_PLAYING: 0,
    GHOST_DIED: 1,
    PLAYER_DYING: 2,
    PLAYER_DIED: 3,
    NEWGAME_STARTING: 4,
    NEWGAME_STARTED: 5,
    GAME_RESTARTING: 6,
    GAME_RESTARTED: 7,
    GAMEOVER: 8,
    LEVEL_BEING_COMPLETED: 9,
    LEVEL_COMPLETED: 10,
    TRANSITION_INTO_NEXT_SCENE: 11,
    CUTSCENE: 13,
    KILL_SCREEN: 14,
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
        let tempWidth = ALTASRECT[idx][2];
        let tempHeight = ALTASRECT[idx][3];
        let drawX = anchorX == 1 ? x - tempWidth / 2 : (anchorX == 0 ? x : x - tempWidth);
        let drawY = anchorY == 1 ? y - tempHeight / 2 : (anchorX == 0 ? y : y - tempHeight);


        this.ctx.drawImage(
            this.image,
            ALTASRECT[idx][0],
            ALTASRECT[idx][1],
            tempWidth,
            tempHeight,
            drawX * this.renderRate,
            drawY * this.renderRate,
            tempWidth * this.renderRate,
            tempHeight * this.renderRate
        )
    }

}