
import {
    levelConfig,
    actorInitial,
    PM_MOVEMENTS,
    ACTORMODE,
    allDirection,
    tunneLadit,
    penExit,
    oppositeDirections,
    penRoutinePos,
    fruitPos
} from './GameRes'





const PM_TILE_SIZE = 8;
const PM_DIR_UP = 1;
const PM_DIR_DOWN = 2;
const PM_DIR_LEFT = 4;
const PM_DIR_RIGHT = 8;


const pacmanAnim = [
    9, 10, 9, 6,//pacman上
    12, 13, 12, 6,//pacman下
    3, 5, 3, 6,//pacman左
    7, 8, 7, 6,//pacman右

    14, 15, 16, 17, 18, 19, 20, 21,//red上下左右
    22, 23, 24, 25, 26, 27, 28, 29,//pink
    30, 31, 32, 33, 34, 35, 36, 37,//blue
    38, 39, 40, 41, 42, 43, 44, 45,//yellow

    50, 51, 52, 53,//受惊
];

const Dir2Anim = {
    1: 0,
    2: 1,
    4: 2,
    8: 3,
}




export default class Actor {
    constructor(id, mainRef) {
        this.id = id;
        this.mainRef = mainRef;
    }







    render(gameRes) {
        if (this.dir) {
            if (this.ghost == false) {
                this.idx = Math.floor(this.mainRef.frame / 3) % 4;
                this.idx += Dir2Anim[this.dir] * 4;
            } else {
                if (this.mainRef.frightModeTime) {
                    this.idx = 48 + Math.floor(this.mainRef.frame / 3) % 2;
                    if (this.mainRef.frightModeTime < this.mainRef.levels.frightTotalTime - this.mainRef.levels.frightTime)
                        this.idx += Math.floor(this.mainRef.frame / 12) % 2 * 2;
                } else {
                    if (this.id == this.mainRef.playerCount) {
                        this.idx = 16 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    } else if (this.id == this.mainRef.playerCount + 1) {
                        this.idx = 24 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    } else if (this.id == this.mainRef.playerCount + 2) {
                        this.idx = 32 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    } else if (this.id == this.mainRef.playerCount + 3) {
                        this.idx = 40 + Math.floor(this.mainRef.frame / 3) % 2 + Dir2Anim[this.dir] * 2;
                    }
                }
            }
        }
        gameRes.renderImage(pacmanAnim[this.idx], this.pos[1] + 4, this.pos[0] + 4 + this.mainRef.playfieldY, 1, 1);
    }


    ///////////////////////////////////////////////////////////





















    resetActor(config) {
        let b = actorInitial[this.id];
        this.pos = [b.y * 8, b.x * 8];
        this.posDelta = [0, 0];
        this.tilePos = [b.y * 8, b.x * 8];
        this.targetPos = [b.scatterY * 8, b.scatterX * 8];
        this.scatterPos = [b.scatterY * 8, b.scatterX * 8];
        this.lastActiveDir = this.dir = b.dir;
        this.physicalSpeed = this.requestedDir = this.nextDir = 0;
        this.updateCurrentSpeed(0);
        this.reverseDirectionsNext = this.freeToLeavePen = this.modeChangedWhileInPen = this.eatenInThisFrightMode = false;
        this.updateTargetPlayerId();
    }








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
                this.mainRef.ghostEyesCount == 0 && this.mainRef.playAmbientSound();
                break
        }

        switch (newMode) {
            case ACTORMODE.CHASE:
                this.fullSpeed = this.mainRef.levels.ghostSpeed * 0.8;
                this.tunnelSpeed = this.mainRef.levels.ghostTunnelSpeed * 0.8;
                this.followingRoutine = false;
                break;
            case ACTORMODE.SCATTER://0b00000010//回到固定目标点上
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
                this.targetPos = [penExit[0], penExit[1]];
                this.freeToLeavePen = this.followingRoutine = false;
                break;
            case ACTORMODE.IN_PEN://0b00010000://16 在围栏(pen)里徘徊
                this.updateTargetPlayerId();
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
    /**
     * For two-player game (with Pac-Man and Ms. Pac-Man) each ghosts randomly
     * focuses on one of the players. This changes every time a ghost leaves
     * a pen to make things more interesting.
     */
    //设置怪物的目标玩家id(针对多个玩家时)
    updateTargetPlayerId = function () {
        if (this.id >= this.mainRef.playerCount)
            this.targetPlayerId = Math.floor(this.mainRef.rand() * this.mainRef.playerCount)
    };

    // We want to be more forgiving with control. If the player presses
    // the arrow one or two pixels *after* the intersection, we still want
    // to allow the turn.
    applyRequestDir(newDir) {//z
        // if (!g.userDisabledSound) {
        //     google.pacManSound = true;
        //     g.updateSoundIcon()
        // }
        //如果玩家请求的方向与当前方向相反
        if (this.dir == oppositeDirections[newDir]) {
            this.dir = newDir;
            this.posDelta = [0, 0];
            this.currentSpeed != 2 && this.updateCurrentSpeed(0);
            if (this.dir != 0) this.lastActiveDir = this.dir;
            this.nextDir = 0
        } else if (this.dir != newDir)
            if (this.dir == 0) {
                if (this.mainRef.playfield[this.pos[0]][this.pos[1]].allowedDir & newDir)
                    this.dir = newDir
            }
            else {
                var tile = this.mainRef.playfield[this.tilePos[0]][this.tilePos[1]];
                if (tile && tile.allowedDir & newDir) {
                    let movement = PM_MOVEMENTS[this.dir];
                    var newPos = [this.pos[0], this.pos[1]];
                    newPos[movement.axis] -= movement.increment;
                    var backtrackDist = 0;
                    if (newPos[0] == this.tilePos[0] && newPos[1] == this.tilePos[1])
                        backtrackDist = 1;
                    else {
                        newPos[movement.axis] -= movement.increment;
                        if (newPos[0] == this.tilePos[0] && newPos[1] == this.tilePos[1])
                            backtrackDist = 2
                    }
                    if (backtrackDist) {
                        this.dir = newDir;
                        this.pos[0] = this.tilePos[0];
                        this.pos[1] = this.tilePos[1];
                        let movement = PM_MOVEMENTS[this.dir];
                        this.pos[movement.axis] += movement.increment * backtrackDist;
                        return
                    }
                }
                this.nextDir = newDir;
                this.posDelta = [0, 0]
            }
    };
    updateNextDir(b) {//i
        var c = this.tilePos,
            d = PM_MOVEMENTS[this.dir],
            tilePos = [c[0], c[1]];
        tilePos[d.axis] += d.increment * 8;
        var field = this.mainRef.playfield[tilePos[0]][tilePos[1]];
        if (b && field.intersection == false)
            field = this.mainRef.playfield[c[0]][c[1]];
        if (field.intersection) {//移动到了交叉路口
            switch (this.mode) {
                case 2:
                case 1:
                case 8:
                    if ((this.dir & field.allowedDir) == 0 && field.allowedDir == oppositeDirections[this.dir]) //死路 需要回头
                        this.nextDir = oppositeDirections[this.dir];
                    else {
                        let minDist = 99999999999;
                        let bestDir = 0;
                        for (var k in allDirection) {//从所有可走的方向中找出离目标点最近的方向
                            var dir = allDirection[k];
                            if (field.allowedDir & dir && this.dir != oppositeDirections[dir]) {
                                let temp = PM_MOVEMENTS[dir];
                                var x = [tilePos[0], tilePos[1]];
                                x[temp.axis] += temp.increment;
                                temp = this.mainRef.getDistance(x, [this.targetPos[0], this.targetPos[1]]);
                                if (temp < minDist) {
                                    minDist = temp;
                                    bestDir = dir
                                }
                            }
                        }
                        if (bestDir) this.nextDir = bestDir
                    }
                    break;
                case 4:
                    if ((this.dir & field.allowedDir) == 0 && field.allowedDir == oppositeDirections[this.dir])//死路 需要回头
                        this.nextDir = oppositeDirections[this.dir];
                    else {
                        let randDir;
                        do randDir = allDirection[Math.floor(this.mainRef.rand() * 4)];
                        while ((randDir & field.allowedDir) == 0 || randDir == oppositeDirections[this.dir]);
                        this.nextDir = randDir
                    }
                    break
            }
        }
    };

    // If Marcin was a good programmer, the algorithms governing Pac-Man
    // movements would be rock solid. That is not the case. Ryan found a bug
    // once that made him go through a wall. If Marcin was a good tester, he
    // would figure out how to reproduce and fix the bug. That is not the
    // case. Hence a little protection below. This checks if a new tile is
    // actually a valid path and if not, go back to the last-known good tile
    // and stop Pac-Man in its tracks. This is essentially a "treating
    // symptoms" protection, but hey, it's better than nothing, right?
    updateTilePos(tilePos) {//p
        this.mainRef.tilesChanged = true;
        if (this.reverseDirectionsNext) {
            this.dir = oppositeDirections[this.dir];
            this.nextDir = 0;
            this.reverseDirectionsNext = false;
            this.updateNextDir(true)
        }
        if (this.ghost == false && this.mainRef.playfield[tilePos[0]][tilePos[1]].path == false) {
            this.pos[0] = this.lastGoodTilePos[0];
            this.pos[1] = this.lastGoodTilePos[1];
            tilePos[0] = this.lastGoodTilePos[0];
            tilePos[1] = this.lastGoodTilePos[1];
            this.dir = 0
        }
        else
            this.lastGoodTilePos = [tilePos[0], tilePos[1]];

        this.mainRef.playfield[tilePos[0]][tilePos[1]].type == 1 &&
            this.mode != 8 ? this.updateCurrentSpeed(2) : this.updateCurrentSpeed(0);
        //pacman吃掉路径上的点
        if (this.ghost == false && this.mainRef.playfield[tilePos[0]][tilePos[1]].dot)
            this.mainRef.dotEaten(this.id, tilePos);

        this.tilePos[0] = tilePos[0];
        this.tilePos[1] = tilePos[1]
    };

    /**
     * Pac-Man and Ms. Pac-Man (but not ghost) are allowed to "corner." If the
     * direction is changed in advance of intersection, a couple pixels (3 or 4)
     * close to the middle of it are taken diagonally, allowing to gain extra
     * distance when ghosts chase you.
     */
    handleCornering() {//t
        var tilePos = this.tilePos;
        let minPos, maxPos;
        switch (this.dir) {
            case 1:
                minPos = [tilePos[0], tilePos[1]];
                maxPos = [tilePos[0] + 3.6, tilePos[1]];
                break;
            case 2:
                minPos = [tilePos[0] - 4, tilePos[1]];
                maxPos = [tilePos[0], tilePos[1]];
                break;
            case 4:
                minPos = [tilePos[0], tilePos[1]];
                maxPos = [tilePos[0], tilePos[1] + 3.6];
                break;
            case 8:
                minPos = [tilePos[0], tilePos[1] - 4];
                maxPos = [tilePos[0], tilePos[1]];
                break
        }
        if (this.pos[0] >= minPos[0] && this.pos[0] <= maxPos[0] && this.pos[1] >= minPos[1] && this.pos[1] <= maxPos[1]) {
            let movement = PM_MOVEMENTS[this.nextDir];
            // The corner increment is stored temporarily in posDelta and added to the proper position only after cornering ends.
            this.posDelta[movement.axis] += movement.increment
        }
    };
    specialField() {//n 特殊位置的操作 n
        //在隧道
        if (this.pos[0] == tunneLadit[0].y * 8 && this.pos[1] == tunneLadit[0].x * 8) {
            this.pos[0] = tunneLadit[1].y * 8;
            this.pos[1] = (tunneLadit[1].x - 1) * 8
        } else if (this.pos[0] == tunneLadit[1].y * 8 && this.pos[1] == tunneLadit[1].x * 8) {
            this.pos[0] = tunneLadit[0].y * 8;
            this.pos[1] = (tunneLadit[0].x + 1) * 8
        }

        if (this.mode == 8 &&
            this.pos[0] == penExit[0] &&
            this.pos[1] == penExit[1])
            this.changeActorMode(64);//怪物出门
        if (this.ghost == false && this.pos[0] == fruitPos[0] && (this.pos[1] == fruitPos[1] || this.pos[1] == fruitPos[1] + 8))
            this.mainRef.eatFruit(this.id)
    };

    applyNextDir() {//u
        this.specialField();
        if (this.ghost)
            this.updateNextDir(false);
        var b = this.mainRef.playfield[this.pos[0]][this.pos[1]];
        if (b.intersection)
            if (this.nextDir && this.nextDir & b.allowedDir) {
                if (this.dir != 0)
                    this.lastActiveDir = this.dir;
                this.dir = this.nextDir;
                this.nextDir = 0;
                if (this.ghost == false) {
                    this.pos[0] += this.posDelta[0];
                    this.pos[1] += this.posDelta[1];
                    this.posDelta = [0, 0]
                }
            }
            else if ((this.dir & b.allowedDir) == 0) {
                if (this.dir != 0)
                    this.lastActiveDir = this.dir;
                this.nextDir = this.dir = 0;
                this.updateCurrentSpeed(0);
            }
    };
    checkCollide() {//o
        var b = this.pos[0] / 8,
            c = this.pos[1] / 8,
            d = [Math.round(b) * 8, Math.round(c) * 8];
        if (d[0] != this.tilePos[0] || d[1] != this.tilePos[1])//移动到了新的块
            this.updateTilePos(d);
        else {
            b = [Math.floor(b) * 8, Math.floor(c) * 8];
            if (this.pos[1] == b[1] && this.pos[0] == b[0])
                this.applyNextDir()
        }
        if (!this.ghost &&
            this.nextDir &&
            this.mainRef.playfield[d[0]][d[1]].intersection &&
            this.nextDir & this.mainRef.playfield[d[0]][d[1]].allowedDir)
            this.handleCornering()
    };

    ////设置移动目标位置
    updateTargetPos() {
        if (this.id == this.mainRef.playerCount && this.mainRef.dotsRemaining < this.mainRef.levels.elroyDotsLeftPart1 && this.mode == 2 && (!this.mainRef.lostLifeOnThisLevel || this.mainRef.actors[this.mainRef.playerCount + 3].mode != 16)) {
            var b = this.mainRef.actors[this.targetPlayerId];
            this.targetPos = [b.tilePos[0], b.tilePos[1]]
        } else if (this.ghost && this.mode == 1) {
            let player = this.mainRef.actors[this.targetPlayerId];
            let movement;
            switch (this.id) {
                // Blinky always follows the player.
                case this.mainRef.playerCount:
                    this.targetPos = [player.tilePos[0], player.tilePos[1]];
                    break;
                // Pinky follows a tile ahead of player.
                case this.mainRef.playerCount + 1:
                    this.targetPos = [player.tilePos[0], player.tilePos[1]];
                    movement = PM_MOVEMENTS[player.dir];
                    this.targetPos[movement.axis] += 32 * movement.increment;
                    // Recreating the original Pac-Man bug, in which UP = UP+LEFT
                    if (player.dir == PM_DIR_UP)
                        this.targetPos[1] -= 4 * PM_TILE_SIZE;
                    break;
                // Inky uses a convoluted scheme averaging Blinky's position and an offset tile.
                case this.mainRef.playerCount + 2:
                    let blinky = this.mainRef.actors[this.mainRef.playerCount];
                    let offsetPos = [player.tilePos[0], player.tilePos[1]];
                    movement = PM_MOVEMENTS[player.dir];
                    offsetPos[movement.axis] += 2 * PM_TILE_SIZE * movement.increment;
                    if (player.dir == PM_DIR_UP)
                        offsetPos[1] -= 2 * PM_TILE_SIZE;
                    this.targetPos[0] = offsetPos[0] * 2 - blinky.tilePos[0];
                    this.targetPos[1] = offsetPos[1] * 2 - blinky.tilePos[1];
                    break;
                // Clyde uses Pac-Man's position if further away, scatter position if close.
                case this.mainRef.playerCount + 3:
                    let distance = this.mainRef.getDistance(player.tilePos, this.tilePos);
                    this.targetPos = distance > (8 * PM_TILE_SIZE) ? [player.tilePos[0], player.tilePos[1]] : this.scatterPos;
                    break
            }
        }
    };
    switchFollowingRoutine() {//v
        this.routineMoveId++;
        if (this.routineMoveId == penRoutinePos[this.routineToFollow].length) {
            if (this.mode == 16 && this.freeToLeavePen && !this.mainRef.ghostExitingPenNow) {
                this.eatenInThisFrightMode ? this.changeActorMode(ACTORMODE.RE_LEAVING_FROM_PEN) : this.changeActorMode(ACTORMODE.LEAVING_PEN);
                return
            } else if (this.mode == ACTORMODE.LEAVING_PEN || this.mode == ACTORMODE.RE_LEAVING_FROM_PEN) {
                this.pos = [penExit[0], penExit[1] + 4];
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
        let b = penRoutinePos[this.routineToFollow][this.routineMoveId];
        this.pos[0] = b.y * 8;
        this.pos[1] = b.x * 8;
        this.dir = b.dir;
        this.physicalSpeed = 0;
        this.speedIntervals = this.mainRef.getSpeedIntervals(b.speed);
        this.proceedToNextRoutineMove = false;
    };
    continueFollowingRoutine() {//m
        var b = penRoutinePos[this.routineToFollow][this.routineMoveId];
        if (b) {
            if (this.speedIntervals[this.mainRef.intervalTime]) {
                var c = PM_MOVEMENTS[this.dir];
                this.pos[c.axis] += c.increment;
                switch (this.dir) {
                    case 1://上
                    case 4://左
                        if (this.pos[c.axis] < b.dest * 8) {
                            this.pos[c.axis] = b.dest * 8;
                            this.proceedToNextRoutineMove = true
                        }
                        break;
                    case 2://下
                    case 8://右
                        if (this.pos[c.axis] > b.dest * 8) {
                            this.pos[c.axis] = b.dest * 8;
                            this.proceedToNextRoutineMove = true
                        }
                        break
                }
                //this.b()
            }
        }
    };
    followRoutine() {//j
        if (this.routineMoveId == -1 || this.proceedToNextRoutineMove)
            this.switchFollowingRoutine();
        this.continueFollowingRoutine()
    };


    updateSpeed() {//d
        switch (this.currentSpeed) {
            case 0:
                var tempSpeed = this.id == this.mainRef.playerCount && (this.mode == 2 || this.mode == 1) ? this.mainRef.cruiseElroySpeed : this.fullSpeed;
                break;
            case 1:
                tempSpeed = this.dotEatingSpeed;
                break;
            case 2:
                tempSpeed = this.tunnelSpeed;
                break
        }
        if (this.physicalSpeed != tempSpeed) {
            this.physicalSpeed = tempSpeed;
            this.speedIntervals = this.mainRef.getSpeedIntervals(this.physicalSpeed)
        }
    }


    updateCurrentSpeed(_speed) {//c
        this.currentSpeed = _speed;
        this.updateSpeed();
    }

    step() {//e
        if (this.dir) {
            if (this.speedIntervals[this.mainRef.intervalTime]) {
                var b = PM_MOVEMENTS[this.dir];
                this.pos[b.axis] += b.increment;
                this.checkCollide();
                //this.b()
            }
        }
    }

    update() {//move
        if (this.mainRef.gameplayMode == 0 ||
            this.ghost && this.mainRef.gameplayMode == 1 && (this.mode == 8 || this.mode == 64)) {
            if (this.requestedDir != 0) {//玩家请求的方向
                this.applyRequestDir(this.requestedDir);
                this.requestedDir = 0
            }
            if (this.followingRoutine) {
                this.followRoutine();
                this.mode == ACTORMODE.ENTERING_PEN && this.followRoutine()
            } else {
                this.step();
                this.mode == ACTORMODE.EATEN && this.step()
            }
        }
    }
}