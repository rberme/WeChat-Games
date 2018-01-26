

// var ghosts = [  // COLOR    CHARACTER   NICKNAME
//     blinky,     // RED      SHADOW      BLINKY
//     pinky,      // PINK     SPEEDY      PINKY
//     inky,       // BLUE     BASHFUL     INKY
//     clyde       // ORANGE   POKEY       CLYDE
// ];


import {
    ACTORINITIAL,
    BLOCKSIZE,
    ACTORMODE,
    PENROUTINEPOS,
    GAMEMODE,
    PENEXIT,

} from '../Misc/GameRes'

const Dir2Anim = {
    1: 0,
    2: 1,
    4: 2,
    8: 3,
}
const oppositeDirections = {
    1: 2,
    2: 1,
    4: 8,
    8: 4
}


const PM_MOVEMENTS = {
    0: {
        axis: 0,
        increment: 0
    },
    4: {//左
        axis: 0,
        increment: -1
    },
    8: {//右
        axis: 0,
        increment: +1
    },
    1: {//上
        axis: 1,
        increment: -1
    },
    2: {//下
        axis: 1,
        increment: +1
    }
}
const allDirection = [1, 4, 2, 8];//
const pacmanAnim = [
    14, 15, 16, 17, 18, 19, 20, 21,//red上下左右
    22, 23, 24, 25, 26, 27, 28, 29,//pink
    30, 31, 32, 33, 34, 35, 36, 37,//blue
    38, 39, 40, 41, 42, 43, 44, 45,//yellow

    50, 51, 52, 53,//受惊

    54, 55, 56, 55,//pacman右大 //

    57, 59, 60, 61, 61, 62, 63,//stick //

    68, 69, 70, 71,//眼睛上下左右  //47
];

const halfBLOCKSIZE = (BLOCKSIZE >> 1);
export default class Ghost {
    constructor(id, mainRef) {
        this.mainRef = mainRef;
        this.id = id;
    }

    resetActor() {

        let init = ACTORINITIAL[this.id];
        this.pos = [];
        this.pos[0] = init.x * BLOCKSIZE + halfBLOCKSIZE;
        this.pos[1] = init.y * BLOCKSIZE + halfBLOCKSIZE;
        this.tilePos = [this.pos[0], this.pos[1]];
        this.targetPos = [init.scatterX * BLOCKSIZE + halfBLOCKSIZE, init.scatterY * BLOCKSIZE + halfBLOCKSIZE];
        this.scatterPos = [init.scatterX * BLOCKSIZE + halfBLOCKSIZE, init.scatterY * BLOCKSIZE + halfBLOCKSIZE];

        this.dir = init.dir;

        this.updateSpeed();
        this.followingRoutine = false;
        this.reverseDirectionsNext = false;
        this.targetPlayerId = 0;
        this.freeToLeavePen = false;
        this.eatenInThisFrightMode = false;

        if (this.id == this.mainRef.playerCount) {
            this.animIdx = 0 + Dir2Anim[this.dir] * 2;
        } else if (this.id == this.mainRef.playerCount + 1) {
            this.animIdx = 8 + Dir2Anim[this.dir] * 2;
        } else if (this.id == this.mainRef.playerCount + 2) {
            this.animIdx = 16 + Dir2Anim[this.dir] * 2;
        } else if (this.id == this.mainRef.playerCount + 3) {
            this.animIdx = 24 + Dir2Anim[this.dir] * 2;
        }
    }

    followRoutine() {
        if (this.routineMoveId == -1 || this.proceedToNextRoutineMove)
            this.switchFollowingRoutine();
        this.continueFollowingRoutine()
    };

    continueFollowingRoutine() {
        var b = PENROUTINEPOS[this.routineToFollow][this.routineMoveId];
        if (b) {
            if (this.speed) {
                switch (this.dir) {
                    case 1://上
                        this.pos[1] -= this.speed;
                        if (this.pos[1] < b.dest * BLOCKSIZE + halfBLOCKSIZE) {
                            this.pos[1] = b.dest * BLOCKSIZE + halfBLOCKSIZE;
                            this.proceedToNextRoutineMove = true
                        }
                        break;
                    case 4://左
                        this.pos[0] -= this.speed;
                        if (this.pos[0] < b.dest * BLOCKSIZE + halfBLOCKSIZE) {
                            this.pos[0] = b.dest * BLOCKSIZE + halfBLOCKSIZE;
                            this.proceedToNextRoutineMove = true
                        }
                        break;
                    case 2://下
                        this.pos[1] += this.speed;
                        if (this.pos[1] > b.dest * BLOCKSIZE + halfBLOCKSIZE) {
                            this.pos[1] = b.dest * BLOCKSIZE + halfBLOCKSIZE;
                            this.proceedToNextRoutineMove = true
                        }
                        break;
                    case 8://右
                        this.pos[0] += this.speed;
                        if (this.pos[0] > b.dest * BLOCKSIZE + halfBLOCKSIZE) {
                            this.pos[0] = b.dest * BLOCKSIZE + halfBLOCKSIZE;
                            this.proceedToNextRoutineMove = true
                        }
                        break
                }
            }

        }
    };
    switchFollowingRoutine() {
        this.routineMoveId++;
        if (this.routineMoveId == PENROUTINEPOS[this.routineToFollow].length) {
            if (this.mode == ACTORMODE.IN_PEN && this.freeToLeavePen && this.mainRef.ghostExitingPenNow == false) {
                this.eatenInThisFrightMode ? this.changeActorMode(ACTORMODE.RE_LEAVING_FROM_PEN) : this.changeActorMode(ACTORMODE.LEAVING_PEN);
                return

            } else if (this.mode == ACTORMODE.LEAVING_PEN || this.mode == ACTORMODE.RE_LEAVING_FROM_PEN) {
                this.pos = [PENEXIT[0], PENEXIT[1]];
                this.dir = this.modeChangedWhileInPen ? 8 : 4;
                var m = this.mainRef.mainGhostMode;
                if (this.mode == ACTORMODE.RE_LEAVING_FROM_PEN && m == ACTORMODE.FRIGHTENED)
                    m = this.mainRef.lastMainGhostMode;
                this.changeActorMode(m);
                return
            } else if (this.mode == ACTORMODE.ENTERING_PEN) {
                if (this.id == this.mainRef.playerCount || this.freeToLeavePen)
                    this.changeActorMode(ACTORMODE.RE_LEAVING_FROM_PEN);
                else {
                    this.eatenInThisFrightMode = true;
                    this.changeActorMode(ACTORMODE.IN_PEN)
                }
                return
            } else
                this.routineMoveId = 0;
        }
        let b = PENROUTINEPOS[this.routineToFollow][this.routineMoveId];
        this.pos[1] = b.y * BLOCKSIZE + halfBLOCKSIZE;
        this.pos[0] = b.x * BLOCKSIZE + halfBLOCKSIZE;
        this.dir = b.dir;
        this.speed = b.speed * 1.5;
        this.proceedToNextRoutineMove = false;
    };

    changeActorMode(newMode) {
        let oldMode = this.mode;
        this.mode = newMode;
        if (this.id == this.mainRef.playerCount + 3 && (newMode == 16 || oldMode == 16))
            this.mainRef.updateCruiseElroySpeed();
        switch (oldMode) {
            case ACTORMODE.LEAVING_PEN://32:
                this.mainRef.ghostExitingPenNow = false;
                break;
            case ACTORMODE.EATEN://8
                this.mainRef.ghostEyesCount > 0 && this.mainRef.ghostEyesCount--;
                //this.mainRef.ghostEyesCount == 0 && this.mainRef.playAmbientSound();
                break
        }

        switch (newMode) {
            case ACTORMODE.CHASE:
                this.fullSpeed = this.mainRef.levels.ghostSpeed * 0.8;
                this.tunnelSpeed = this.mainRef.levels.ghostTunnelSpeed * 0.8;
                this.followingRoutine = false;
                break;
            case ACTORMODE.SCATTER:
                this.targetPos = this.scatterPos;
                this.fullSpeed = this.mainRef.levels.ghostSpeed * 0.8;
                this.tunnelSpeed = this.mainRef.levels.ghostTunnelSpeed * 0.8;
                this.followingRoutine = false;
                break;
            case ACTORMODE.FRIGHTENED://0b00000100:
                this.fullSpeed = this.mainRef.levels.ghostFrightSpeed * 0.8;
                this.tunnelSpeed = this.mainRef.levels.ghostTunnelSpeed * 0.8;
                this.followingRoutine = false;
                break;
            case ACTORMODE.EATEN: //0b00001000://在围栏(pen)里徘徊
                this.tunnelSpeed = this.fullSpeed = 1.6;
                this.targetPos = [PENEXIT[0], PENEXIT[1]];
                this.freeToLeavePen = this.followingRoutine = false;
                break;
            case ACTORMODE.IN_PEN:
                this.targetPlayerId = 0;
                this.followingRoutine = true;
                this.routineMoveId = -1;
                switch (this.id) {
                    case this.mainRef.playerCount + 1:
                        this.routineToFollow = 2;
                        break;
                    case this.mainRef.playerCount + 2:
                        this.routineToFollow = 1;
                        break;
                    case this.mainRef.playerCount + 3:
                        this.routineToFollow = 3;
                        break
                }
                break;
            case ACTORMODE.LEAVING_PEN://32
                this.followingRoutine = true;
                this.routineMoveId = -1;
                switch (this.id) {
                    case this.mainRef.playerCount + 1:
                        this.routineToFollow = 5;
                        break;
                    case this.mainRef.playerCount + 2:
                        this.routineToFollow = 4;
                        break;
                    case this.mainRef.playerCount + 3:
                        this.routineToFollow = 6;
                        break
                }
                this.mainRef.ghostExitingPenNow = true;
                break;
            case ACTORMODE.ENTERING_PEN://0b01000000://64
                this.followingRoutine = true;
                this.routineMoveId = -1;
                switch (this.id) {
                    case this.mainRef.playerCount:
                    case this.mainRef.playerCount + 1:
                        this.routineToFollow = 8;
                        break;
                    case this.mainRef.playerCount + 2:
                        this.routineToFollow = 7;
                        break;
                    case this.mainRef.playerCount + 3:
                        this.routineToFollow = 9;
                        break
                }
                break;
            case ACTORMODE.RE_LEAVING_FROM_PEN://0b10000000://128
                this.followingRoutine = true;
                this.routineMoveId = -1;
                switch (this.id) {
                    case this.mainRef.playerCount:
                    case this.mainRef.playerCount + 1:
                        this.routineToFollow = 11;
                        break;
                    case this.mainRef.playerCount + 2:
                        this.routineToFollow = 10;
                        break;
                    case this.mainRef.playerCount + 3:
                        this.routineToFollow = 12;
                        break
                }
                break
        }
        this.updateSpeed();
    }



    move() {
        let mapWidth = (this.mainRef.worldMap.playfieldWidth + 1) * BLOCKSIZE

        let moveDistance = this.speed * 1.5;
        if (this.mode != ACTORMODE.EATEN && Math.round(this.pos[1]) == 14 * BLOCKSIZE + halfBLOCKSIZE &&
            this.pos[0] < BLOCKSIZE + halfBLOCKSIZE || this.pos[0] > 26 * BLOCKSIZE + halfBLOCKSIZE)
            moveDistance = this.tunnelSpeed * 1.5;



        if (this.reverseDirectionsNext) {
            this.dir = oppositeDirections[this.dir];
            this.reverseDirectionsNext = false;
        }

        while (moveDistance > 0) {
            let fixedPosX = Math.round(this.pos[0]);
            let fixedPosY = Math.round(this.pos[1]);
            let blockXX = fixedPosX % BLOCKSIZE;
            let blockYY = fixedPosY % BLOCKSIZE;

            if (this.mode == ACTORMODE.EATEN) {

            }


            if (blockXX != halfBLOCKSIZE) {//横向
                if (blockXX < halfBLOCKSIZE) {//在左半边
                    if (this.dir == 4) {//往左移动
                        let maxDist = blockXX + halfBLOCKSIZE;
                        if (moveDistance >= maxDist) {
                            this.pos[0] -= maxDist;
                            if (this.pos[0] < -halfBLOCKSIZE) this.pos[0] += mapWidth + halfBLOCKSIZE;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[0] -= moveDistance;
                            if (this.pos[0] < -halfBLOCKSIZE) this.pos[0] += mapWidth + halfBLOCKSIZE;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.dir == 8) {//往右移动
                        let maxDist = halfBLOCKSIZE - blockXX;
                        if (moveDistance >= maxDist) {
                            this.pos[0] += maxDist;
                            if (this.pos[0] > mapWidth + halfBLOCKSIZE) this.pos[0] -= (mapWidth + halfBLOCKSIZE);
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[0] += moveDistance;
                            if (this.pos[0] > mapWidth + halfBLOCKSIZE) this.pos[0] -= (mapWidth + halfBLOCKSIZE);
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
                else {//在格子右半边
                    if (this.dir == 4) {//往左移动
                        let maxDist = blockXX - halfBLOCKSIZE;
                        if (moveDistance >= maxDist) {
                            this.pos[0] -= maxDist;
                            if (this.pos[0] < -halfBLOCKSIZE) this.pos[0] += mapWidth + halfBLOCKSIZE;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[0] -= moveDistance;
                            if (this.pos[0] < -halfBLOCKSIZE) this.pos[0] += mapWidth + halfBLOCKSIZE;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.dir == 8) {//往右移动
                        let maxDist = BLOCKSIZE - blockXX + halfBLOCKSIZE;
                        if (moveDistance >= maxDist) {
                            this.pos[0] += maxDist;
                            if (this.pos[0] > mapWidth + halfBLOCKSIZE) this.pos[0] -= (mapWidth + halfBLOCKSIZE);
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[0] += moveDistance;
                            if (this.pos[0] > mapWidth + halfBLOCKSIZE) this.pos[0] -= (mapWidth + halfBLOCKSIZE);
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
            }
            else if (blockYY != halfBLOCKSIZE) {//竖向
                if (blockYY < halfBLOCKSIZE) {//在上半边
                    if (this.dir == 1) {//往上移动
                        let maxDist = blockYY + halfBLOCKSIZE;
                        if (moveDistance >= maxDist) {
                            this.pos[1] -= maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[1] -= moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.dir == 2) {//往下移动
                        let maxDist = halfBLOCKSIZE - blockYY;
                        if (moveDistance >= maxDist) {
                            this.pos[1] += maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[1] += moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
                else {//在格子下半边
                    if (this.dir == 1) {//往上移动
                        let maxDist = blockYY - halfBLOCKSIZE;
                        if (moveDistance >= maxDist) {
                            this.pos[1] -= maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[1] -= moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.dir == 2) {//往下移动
                        let maxDist = BLOCKSIZE - blockYY + halfBLOCKSIZE;
                        if (moveDistance >= maxDist) {
                            this.pos[1] += maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.pos[1] += moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
            }
            else {//在中心
                if (this.dir == 1) {//往上移动
                    let maxDist = BLOCKSIZE;
                    if (moveDistance >= maxDist) {
                        this.pos[1] -= maxDist;
                        moveDistance -= maxDist;
                    }
                    else {
                        this.pos[1] -= moveDistance;
                        moveDistance = 0;
                        continue;
                    }
                }
                else if (this.dir == 2) {//往下移动
                    let maxDist = BLOCKSIZE;
                    if (moveDistance >= maxDist) {
                        this.pos[1] += maxDist;
                        moveDistance -= maxDist;
                    }
                    else {
                        this.pos[1] += moveDistance;
                        moveDistance = 0;
                        continue;
                    }
                }
                else if (this.dir == 4) {//往左移动
                    let maxDist = BLOCKSIZE;
                    if (moveDistance >= maxDist) {
                        this.pos[0] -= maxDist;
                        if (this.pos[0] < -halfBLOCKSIZE) this.pos[0] += mapWidth + halfBLOCKSIZE;
                        moveDistance -= maxDist;
                    }
                    else {
                        this.pos[0] -= moveDistance;
                        if (this.pos[0] < -halfBLOCKSIZE) this.pos[0] += mapWidth + halfBLOCKSIZE;
                        moveDistance = 0;
                        continue;
                    }
                }
                else if (this.dir == 8) {//往右移动        
                    let maxDist = BLOCKSIZE;
                    if (moveDistance >= maxDist) {
                        this.pos[0] += maxDist;
                        if (this.pos[0] > mapWidth + halfBLOCKSIZE) this.pos[0] -= (mapWidth + halfBLOCKSIZE);
                        moveDistance -= maxDist;
                    }
                    else {
                        this.pos[0] += moveDistance;
                        if (this.pos[0] > mapWidth + halfBLOCKSIZE) this.pos[0] -= (mapWidth + halfBLOCKSIZE);
                        moveDistance = 0;
                        continue;
                    }
                } else break;
            }

            if (this.mode == ACTORMODE.EATEN &&
                Math.round(this.pos[0]) == PENEXIT[0] &&
                Math.round(this.pos[1]) == PENEXIT[1]) {
                this.changeActorMode(ACTORMODE.ENTERING_PEN);//怪物进门
                return;
            }
            //break;
            this.updateDir();
        }
    }


    updateDir() {
        var field = this.mainRef.worldMap.playfield[Math.round(this.pos[1]) - halfBLOCKSIZE][Math.round(this.pos[0]) - halfBLOCKSIZE];
        if (field.intersection) {//移动到了交叉路口
            switch (this.mode) {
                case ACTORMODE.SCATTER:
                case ACTORMODE.CHASE:
                case ACTORMODE.EATEN:
                    if ((this.dir & field.allowedDir) == 0 && field.allowedDir == oppositeDirections[this.dir]) //死路 需要回头
                        this.nextDir = oppositeDirections[this.dir];
                    else {
                        let minDist = 99999999999;
                        let bestDir = 0;
                        for (var k in allDirection) {//从所有可走的方向中找出离目标点最近的方向
                            var dir = allDirection[k];
                            if (field.allowedDir & dir && this.dir != oppositeDirections[dir]) {
                                let temp = PM_MOVEMENTS[dir];
                                var x = [this.pos[0], this.pos[1]];
                                x[temp.axis] += temp.increment;
                                temp = this.mainRef.getDistance(x, [this.targetPos[0], this.targetPos[1]]);
                                if (temp < minDist) {
                                    minDist = temp;
                                    bestDir = dir
                                }
                            }
                        }
                        if (bestDir) this.dir = bestDir
                    }
                    break;
                case ACTORMODE.FRIGHTENED:
                    if ((this.dir & field.allowedDir) == 0 && field.allowedDir == oppositeDirections[this.dir])//死路 需要回头
                        this.dir = oppositeDirections[this.dir];
                    else {
                        let randDir;
                        do randDir = allDirection[Math.floor(this.mainRef.rand() * 4)];
                        while ((randDir & field.allowedDir) == 0 || randDir == oppositeDirections[this.dir]);
                        this.dir = randDir
                    }
                    break
            }
        }
    }


    ////设置移动目标位置
    updateTargetPos() {
        if (this.id == this.mainRef.playerCount && this.mainRef.dotsRemaining < this.mainRef.levels.elroyDotsLeftPart1 && this.mode == 2 && (!this.mainRef.lostLifeOnThisLevel || this.mainRef.actors[3].mode != 16)) {
            var b = this.mainRef.player;///.actors[this.targetPlayerId];
            this.targetPos = [b.pos[0], b.pos[1]]
        } else if (this.mode == ACTORMODE.CHASE) {
            let player = this.mainRef.player;//this.mainRef.actors[this.targetPlayerId];
            let movement;
            switch (this.id) {
                // Blinky always follows the player.
                case this.mainRef.playerCount:
                    this.targetPos = [player.pos[0], player.pos[1]];
                    break;
                // Pinky follows a tile ahead of player.
                case this.mainRef.playerCount + 1:
                    this.targetPos = [player.pos[0], player.pos[1]];
                    movement = PM_MOVEMENTS[player.dir];
                    this.targetPos[movement.axis] += 32 * movement.increment;
                    // Recreating the original Pac-Man bug, in which UP = UP+LEFT
                    if (player.dir == 1)
                        this.targetPos[1] -= 4 * BLOCKSIZE;
                    break;
                // Inky uses a convoluted scheme averaging Blinky's position and an offset tile.
                case this.mainRef.playerCount + 2:
                    let blinky = this.mainRef.actors[0];
                    let offsetPos = [player.pos[0], player.pos[1]];
                    movement = PM_MOVEMENTS[player.dir];
                    offsetPos[movement.axis] += 2 * BLOCKSIZE * movement.increment;
                    if (player.dir == 1)
                        offsetPos[1] -= 2 * BLOCKSIZE;
                    this.targetPos[0] = offsetPos[0] * 2 - blinky.pos[0];
                    this.targetPos[1] = offsetPos[1] * 2 - blinky.pos[1];
                    break;
                // Clyde uses Pac-Man's position if further away, scatter position if close.
                case this.mainRef.playerCount + 3:
                    let distance = this.mainRef.getDistance(player.pos, this.pos);
                    this.targetPos = distance > (8 * BLOCKSIZE) ? [player.pos[0], player.pos[1]] : this.scatterPos;
                    break
            }
        }
    };


    update() {
        if (this.followingRoutine) {
            this.followRoutine();
        } else {
            //this.step();
            this.move();
            if (this.mode == ACTORMODE.CHASE || this.mode == ACTORMODE.SCATTER || this.mode == ACTORMODE.FRIGHTENED) {
                var b = (this.pos[0] - halfBLOCKSIZE) / 8,
                    c = (this.pos[1] - halfBLOCKSIZE) / 8,
                    tilePos = [Math.round(b) * 8 + halfBLOCKSIZE, Math.round(c) * 8 + halfBLOCKSIZE];
                if (tilePos[0] != this.tilePos[0] || tilePos[1] != this.tilePos[1]) {//移动到了新的块
                    this.tilePos[0] = tilePos[0];
                    this.tilePos[1] = tilePos[1];
                    this.mainRef.tilesChanged = true;
                }
            }
        }

        if (this.dir) {
            if (this.mode == ACTORMODE.EATEN) {
                this.animIdx = 47 + Dir2Anim[this.dir];
            } else {
                if (this.mainRef.frightModeTime) {//this.mainRef.frightModeTime) {
                    this.animIdx = 32 + Math.floor(this.mainRef.frame / 3) % 2;
                    if (this.mainRef.frightModeTime < this.mainRef.levels.frightTotalTime - this.mainRef.levels.frightTime)
                        this.animIdx += Math.floor(this.mainRef.frame / 12) % 2 * 2;
                } else {
                    if (this.id == this.mainRef.playerCount) {
                        this.animIdx = 0 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    } else if (this.id == this.mainRef.playerCount + 1) {
                        this.animIdx = 8 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    } else if (this.id == this.mainRef.playerCount + 2) {
                        this.animIdx = 16 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    } else if (this.id == this.mainRef.playerCount + 3) {
                        this.animIdx = 24 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    }
                }
            }
        }
    }

    updateSpeed() {//d
        this.speed = this.id == this.mainRef.playerCount && (this.mode == 2 || this.mode == 1) ? this.mainRef.cruiseElroySpeed : this.fullSpeed;
    }

    render(gameRes) {
        gameRes.renderImage(pacmanAnim[this.animIdx], this.pos[0], this.pos[1] + this.mainRef.worldMap.playfieldY, 1, 1);
    }
}