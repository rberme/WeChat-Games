

const altasRect = {
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
export const PEN_LEAVING_FOOD_LIMITS = [0, 7, 17, 32];
export const allDirection = [1, 4, 2, 8];//上,左,下,右
export const PM_MOVEMENTS = {
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


export const CUTSCENE = {//cutscene
    1: {
        actors: [{
            ghost: false,
            x: 30,
            y: 16,
            id: 0
        },
        {
            ghost: true,
            x: 33.2,
            y: 16,
            id: 1
        }],
        sequence: [{
            time: 5.5,
            moves: [{
                dir: 4,
                speed: 0.75 * 0.8// * 2
            },
            {
                dir: 4,
                speed: 0.78 * 0.8// * 2
            }]
        },
        {
            time: 0.1,
            moves: [{
                dir: 4,
                speed: 16
            },
            {
                dir: 4,
                speed: 0
            }]
        },
        {
            time: 9,
            moves: [{
                dir: 8,
                speed: 0.75 * 0.8,// * 2,
                elId: 1,
                //elId: "pcm-bpcm"
            },
            {
                dir: 8,
                speed: 0.4,//0.8,
                mode: 4
            }]
        }]
    },
    2: {
        actors: [{
            ghost: false,
            x: 30,
            y: 16,
            id: 0
        },
        {
            ghost: true,
            x: 14.4,
            y: 16.5,
            id: 2
        },
        {
            ghost: true,
            x: 33.2,
            y: 16,
            id: 1
        }
        ],
        sequence: [
            {
                time: 2.7,
                moves: [{
                    dir: 4,
                    speed: 0.75 * 0.8// * 2
                },
                {
                    dir: 0,
                    speed: 0,
                    elId: 56//elId: "pcm-stck"
                },
                {
                    dir: 4,
                    speed: 0.78 * 0.8// * 2
                }]
            },
            {
                time: 1,
                moves: [{
                    dir: 4,
                    speed: 0.75 * 0.8// * 2
                },
                {
                    dir: 0,
                    speed: 0,
                    elId: 57//"pcm-stck"
                },
                {
                    dir: 4,
                    speed: 0.1 * 0.4// 0.8
                }]
            },
            {
                time: 1.3,
                moves: [{
                    dir: 4,
                    speed: 0.75 * 0.8// * 2
                },
                {
                    dir: 0,
                    speed: 0,
                    elId: 58//"pcm-stck"
                },
                {
                    dir: 4,
                    speed: 0
                }]
            },
            {
                time: 1,
                moves: [{
                    dir: 4,
                    speed: 0.75 * 0.8// * 2
                },
                {
                    dir: 0,
                    speed: 0,
                    elId: 59//"pcm-stck"
                },
                {
                    dir: 4,
                    speed: 0,
                    elId: 61//"pcm-ghfa"
                }]
            },
            {
                time: 2.5,
                moves: [{
                    dir: 4,
                    speed: 0.75 * 0.8// * 2
                },
                {
                    dir: 0,
                    speed: 0,
                    elId: 60//"pcm-stck"
                },
                {
                    dir: 4,
                    speed: 0,
                    elId: 62//"pcm-ghfa"
                }]
            }]
    },
    3: {
        actors: [{
            ghost: false,
            x: 30,
            y: 16,
            id: 0
        },
        {
            ghost: true,
            x: 33.2,
            y: 16,
            id: 2
        }],
        sequence: [{
            time: 5.3,
            moves: [{
                dir: 4,
                speed: 0.75 * 0.8// * 2
            },
            {
                dir: 4,
                speed: 0.78 * 0.8,// * 2,
                elId: 64
                //elId: "pcm-ghin"
            }]
        },
        {
            time: 5.3,
            moves: [{
                dir: 4,
                speed: 0
            },
            {
                dir: 8,
                speed: 0.78 * 0.8, //* 2,
                elId: 66
                //elId: "pcm-gbug"
            }]
        }]
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

export const penExit = [88, 104];//围栏的出口
export const fruitPos = [135, 104];//水果的位置
export const tunneLadit = [//隧道口
    {
        x: -2,
        y: 14
    },
    {
        x: 29,
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

export const Energizer = [
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
    }]

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

export const levelConfig = [
    {},//关卡配置数据
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
    {
        ghostSpeed: 0.85,
        ghostTunnelSpeed: 0.45,
        playerSpeed: 0.9,
        dotEatingSpeed: 0.79,
        ghostFrightSpeed: 0.55,
        playerFrightSpeed: 0.95,
        dotEatingFrightSpeed: 0.83,
        elroyDotsLeftPart1: 30,
        elroySpeedPart1: 0.9,
        elroyDotsLeftPart2: 15,
        elroySpeedPart2: 0.95,
        frightTime: 5,
        frightBlinkCount: 5,
        fruit: 2,
        fruitScore: 300,
        ghostModeSwitchTimes: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
        penForceTime: 4,
        penLeavingLimits: [0, 0, 0, 50],
        cutsceneId: 1
    },
    {
        ghostSpeed: 0.85,
        ghostTunnelSpeed: 0.45,
        playerSpeed: 0.9,
        dotEatingSpeed: 0.79,
        ghostFrightSpeed: 0.55,
        playerFrightSpeed: 0.95,
        dotEatingFrightSpeed: 0.83,
        elroyDotsLeftPart1: 40,
        elroySpeedPart1: 0.9,
        elroyDotsLeftPart2: 20,
        elroySpeedPart2: 0.95,
        frightTime: 4,
        frightBlinkCount: 5,
        fruit: 3,
        fruitScore: 500,
        ghostModeSwitchTimes: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
        penForceTime: 4,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.85,
        ghostTunnelSpeed: 0.45,
        playerSpeed: 0.9,
        dotEatingSpeed: 0.79,
        ghostFrightSpeed: 0.55,
        playerFrightSpeed: 0.95,
        dotEatingFrightSpeed: 0.83,
        elroyDotsLeftPart1: 40,
        elroySpeedPart1: 0.9,
        elroyDotsLeftPart2: 20,
        elroySpeedPart2: 0.95,
        frightTime: 3,
        frightBlinkCount: 5,
        fruit: 3,
        fruitScore: 500,
        ghostModeSwitchTimes: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
        penForceTime: 4,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 40,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 20,
        elroySpeedPart2: 1.05,
        frightTime: 2,
        frightBlinkCount: 5,
        fruit: 4,
        fruitScore: 700,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0],
        cutsceneId: 2
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 50,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 25,
        elroySpeedPart2: 1.05,
        frightTime: 5,
        frightBlinkCount: 5,
        fruit: 4,
        fruitScore: 700,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 50,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 25,
        elroySpeedPart2: 1.05,
        frightTime: 2,
        frightBlinkCount: 5,
        fruit: 5,
        fruitScore: 1E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 50,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 25,
        elroySpeedPart2: 1.05,
        frightTime: 2,
        frightBlinkCount: 5,
        fruit: 5,
        fruitScore: 1E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 60,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 30,
        elroySpeedPart2: 1.05,
        frightTime: 1,
        frightBlinkCount: 3,
        fruit: 6,
        fruitScore: 2E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0],
        cutsceneId: 3
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 60,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 30,
        elroySpeedPart2: 1.05,
        frightTime: 5,
        frightBlinkCount: 5,
        fruit: 6,
        fruitScore: 2E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 60,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 30,
        elroySpeedPart2: 1.05,
        frightTime: 2,
        frightBlinkCount: 5,
        fruit: 7,
        fruitScore: 3E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 80,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 40,
        elroySpeedPart2: 1.05,
        frightTime: 1,
        frightBlinkCount: 3,
        fruit: 7,
        fruitScore: 3E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 80,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 40,
        elroySpeedPart2: 1.05,
        frightTime: 1,
        frightBlinkCount: 3,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0],
        cutsceneId: 3
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 80,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 40,
        elroySpeedPart2: 1.05,
        frightTime: 3,
        frightBlinkCount: 5,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 100,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 50,
        elroySpeedPart2: 1.05,
        frightTime: 1,
        frightBlinkCount: 3,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 100,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 50,
        elroySpeedPart2: 1.05,
        frightTime: 1,
        frightBlinkCount: 3,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 100,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 50,
        elroySpeedPart2: 1.05,
        frightTime: 0,
        frightBlinkCount: 0,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0],
        cutsceneId: 3
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 100,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 50,
        elroySpeedPart2: 1.05,
        frightTime: 1,
        frightBlinkCount: 3,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 120,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 60,
        elroySpeedPart2: 1.05,
        frightTime: 0,
        frightBlinkCount: 0,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 1,
        dotEatingSpeed: 0.87,
        ghostFrightSpeed: 0.6,
        playerFrightSpeed: 1,
        dotEatingFrightSpeed: 0.87,
        elroyDotsLeftPart1: 120,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 60,
        elroySpeedPart2: 1.05,
        frightTime: 0,
        frightBlinkCount: 0,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    },
    {
        ghostSpeed: 0.95,
        ghostTunnelSpeed: 0.5,
        playerSpeed: 0.9,
        dotEatingSpeed: 0.79,
        ghostFrightSpeed: 0.75,
        playerFrightSpeed: 0.9,
        dotEatingFrightSpeed: 0.79,
        elroyDotsLeftPart1: 120,
        elroySpeedPart1: 1,
        elroyDotsLeftPart2: 60,
        elroySpeedPart2: 1.05,
        frightTime: 0,
        frightBlinkCount: 0,
        fruit: 8,
        fruitScore: 5E3,
        ghostModeSwitchTimes: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        penForceTime: 3,
        penLeavingLimits: [0, 0, 0, 0]
    }];

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