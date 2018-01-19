
import { levelConfig, actorInitial, axisIncrement, actorMode, allDirection, tunneLadit, penExit, oppositeDirections, penRoutinePos } from './GameRes'

export default class Actor {
    constructor(id, mainRef) {
        this.id = id;
        this.mainRef = mainRef;
    }

    resetActor(config) {
        let b = actorInitial[this.id];
        this.pos = [b.y * 8, b.x * 8];
        this.tilePos = [b.y * 8, b.x * 8];

        this.targetPos = [b.scatterY * 8, b.scatterX * 8];
        this.scatterPos = [b.scatterY * 8, b.scatterX * 8];
        this.lastActiveDir = this.dir = b.dir;
        this.currentSpeed = 0;
        this.physicalSpeed = 0;
        this.updateSpeed(0);
        this.reverseDirectionsNext = this.freeToLeavePen = this.modeChangedWhileInPen = this.eatenInThisFrightMode = false;
        this.updateTargetPlayerId();
    }

    update() {
        if (this.mainRef.gameplayMode == 0 ||
            this.ghost && this.mainRef.gameplayMode == 1 && (this.mode == 8 || this.mode == 64)) {
            // if (this.requestedDir != 0) {//玩家请求的方向
            //     this.applyRequestDir(this.requestedDir);
            //     this.requestedDir = 0
            // }
            if (this.followingRoutine) {
                this.j();
                this.mode == 64 && this.j()
            } else {
                this.e();
                this.mode == 8 && this.e()
            }
        }
    }

    e() {
        if (this.dir) {
            if (this.speedIntervals[this.mainRef.intervalTime]) {
                var b = axisIncrement[this.dir];
                this.pos[b.axis] += b.increment;
                this.checkCollide();
                //this.b()
            }
        }
    }

    render(gameRes) {
        gameRes.renderImage(3, this.pos[1] + 4, this.pos[0] + 4 + this.mainRef.playfieldY, 1, 1);
    }


    ///////////////////////////////////////////////////////////

    applyRequestDir(b) {
        // if (!g.userDisabledSound) {
        //     google.pacManSound = true;
        //     g.updateSoundIcon()
        // }
        //如果玩家请求的方向与当前方向相反
        if (this.dir == oppositeDirections[b]) {
            this.dir = b;
            this.posDelta = [0, 0];
            this.currentSpeed != 2 && this.updateSpeed(0);
            if (this.dir != 0) this.lastActiveDir = this.dir;
            this.nextDir = 0
        } else if (this.dir != b) {
            if (this.dir == 0) {
                if (this.mainRef.playfield[this.pos[0]][this.pos[1]].allowedDir & b)
                    this.dir = b
            }
        } else {
            var c = this.mainRef.playfield[this.tilePos[0]][this.tilePos[1]];
            if (c && c.allowedDir & b) {
                c = axisIncrement[this.dir];
                var d = [this.pos[0], this.pos[1]];
                d[c.axis] -= c.increment;
                var f = 0;
                if (d[0] == this.tilePos[0] && d[1] == this.tilePos[1])
                    f = 1;
                else {
                    d[c.axis] -= c.increment;
                    if (d[0] == this.tilePos[0] && d[1] == this.tilePos[1])
                        f = 2
                }
                if (f) {
                    this.dir = b;
                    this.pos[0] = this.tilePos[0];
                    this.pos[1] = this.tilePos[1];
                    c = axisIncrement[this.dir];
                    this.pos[c.axis] += c.increment * f;
                    return
                }
            }
            this.nextDir = b;
            this.posDelta = [0, 0]
        }
    };


    j() {
        if (this.routineMoveId == -1 || this.proceedToNextRoutineMove)
            this.v();
        this.m()
    };

    v() {
        this.routineMoveId++;
        if (this.routineMoveId == penRoutinePos[this.routineToFollow].length) {
            if (this.mode == 16 && this.freeToLeavePen && !this.mainRef.ghostExitingPenNow) {
                this.eatenInThisFrightMode ? this.changeActorMode(128) : this.changeActorMode(actorMode.EXITINGPEN);
                return
            } else if (this.mode == actorMode.EXITINGPEN || this.mode == 128) {
                this.pos = [penExit[0], penExit[1] + 4];
                this.dir = this.modeChangedWhileInPen ? 8 : 4;
                var m = this.mainRef.mainGhostMode;
                if (this.mode == 128 && m == 4)
                    m = this.mainRef.lastMainGhostMode;
                this.changeActorMode(m);
                return
            } else if (this.mode == 64) {
                if (this.id == this.mainRef.playerCount || this.freeToLeavePen)
                    this.changeActorMode(128);
                else {
                    this.eatenInThisFrightMode = true;
                    this.changeActorMode(16)
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
    m() {
        var b = penRoutinePos[this.routineToFollow][this.routineMoveId];
        if (b) {
            if (this.speedIntervals[this.mainRef.intervalTime]) {
                var c = axisIncrement[this.dir];
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
    specialField() {//特殊位置的操作 n
        //在隧道
        if (this.pos[0] == tunneLadit[0].x * 8 && this.pos[1] == tunneLadit[0].y * 8) {
            this.pos[1] = tunneLadit[1].y * 8;
            this.pos[0] = (tunneLadit[1].x - 1) * 8
        } else if (this.pos[0] == tunneLadit[1].y * 8 && this.pos[1] == tunneLadit[1].x * 8) {
            this.pos[0] = tunneLadit[0].y * 8;
            this.pos[1] = (tunneLadit[0].x + 1) * 8
        }

        this.mode == 8 &&
            this.pos[0] == penExit[0] &&
            this.pos[1] == penExit[1] &&
            this.changeActorMode(64);//怪物出门
        // if (this.ghost == false && this.pos[0] == v[0] && (this.pos[1] == v[1] || this.pos[1] == v[1] + 8))
        //     g.eatFruit(this.id)
    };


    applyNextDir() {//u
        //this.specialField();
        this.ghost && this.updateNextDir(false);
        var b = this.mainRef.playfield[this.pos[0]][this.pos[1]];
        if (b.intersection) {
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
        } else if ((this.dir & b.allowedDir) == 0) {
            if (this.dir != 0)
                this.lastActiveDir = this.dir;
            this.nextDir = this.dir = 0;
            this.updateSpeed(0);
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
            this.pos[1] == b[1] && this.pos[0] == b[0] && this.applyNextDir()
        }
        this.ghost == false &&
            this.nextDir &&
            this.mainRef.playfield[d[0]][d[1]].intersection &&
            this.nextDir & this.mainRef.playfield[d[0]][d[1]].allowedDir &&
            this.t()
    };

    updateTilePos(b) {
        this.mainRef.tilesChanged = true;
        if (this.reverseDirectionsNext) {
            this.dir = oppositeDirections[this.dir];
            this.nextDir = 0;
            this.reverseDirectionsNext = false;
            this.updateNextDir(true)
        }
        if (this.ghost == false && mainRef.playfield[b[0]][b[1]].path == false) {
            this.pos[0] = this.lastGoodTilePos[0];
            this.pos[1] = this.lastGoodTilePos[1];
            b[0] = this.lastGoodTilePos[0];
            b[1] = this.lastGoodTilePos[1];
            this.dir = 0
        }
        else
            this.lastGoodTilePos = [b[0], b[1]];

        this.mainRef.playfield[b[0]][b[1]].type == 1 &&
            this.mode != 8 ? this.updateSpeed(2) : this.updateSpeed(0);
        //pacman吃掉路径上的点
        //this.ghost==false && g.playfield[b[0]][b[1]].dot && g.dotEaten(this.id, b);

        this.tilePos[0] = b[0];
        this.tilePos[1] = b[1]
    };

    updateNextDir(b) {//i
        var c = this.tilePos,
            d = axisIncrement[this.dir],
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
                                let temp = axisIncrement[dir];
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
                        do randDir = allDirection[Math.floor(this.mainRef.rand() * 4)];
                        while ((randDir & h.allowedDir) == 0 || randDir == oppositeDirections[this.dir]);
                        this.nextDir = f
                    }
                    break
            }
        }
    };



    changeActorMode(newMode) {
        let oldMode = this.mode;
        this.mode = newMode;
        switch (oldMode) {
            case actorMode.EXITINGPEN://32:
                this.mainRef.ghostExitingPenNow = false;
                break;
            // case 8:
            //     this.mainRef.ghostEyesCount > 0 && g.ghostEyesCount--;
            //     this.mainRef.ghostEyesCount == 0 && g.playAmbientSound();
            //     break
        }

        switch (newMode) {
            case 0b00000001:
                this.fullSpeed = this.mainRef.levels.ghostSpeed * 0.8;
                this.tunnelSpeed = this.mainRef.levels.ghostTunnelSpeed * 0.8;
                this.followingRoutine = false;
                break;
            case actorMode.RESET://回到固定目标点上
                this.targetPos = this.scatterPos;
                this.fullSpeed = this.mainRef.levels.ghostSpeed * 0.8;
                this.tunnelSpeed = this.mainRef.levels.ghostTunnelSpeed * 0.8;
                this.followingRoutine = false;
                break;
            case 0b00001000://在围栏(pen)里徘徊
                this.tunnelSpeed = this.fullSpeed = 1.6;
                this.targetPos = [penExit[0], penExit[1]];
                this.freeToLeavePen = this.followingRoutine = false;
                break;
            case actorMode.WAIT://0b00010000://16 在围栏(pen)里徘徊
                this.updateTargetPlayerId();
                this.routineMoveId = -1;
                this.followingRoutine = true;
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
            case actorMode.EXITINGPEN://32
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

        }
        this.updateSpeed();
    }

    //设置怪物的目标玩家id(针对多个玩家时)
    updateTargetPlayerId = function () {
        if (this.id >= this.playerCount)
            this.targetPlayerId = 0//Math.floor(g.rand() * g.playerCount)
    };

    updateSpeed(_speed) {//c
        if (_speed)
            this.currentSpeed = _speed;
        switch (this.currentSpeed) {
            case 0:
                var tempSpeed = this.fullSpeed;//this.id == g.playerCount && (this.mode == 2 || this.mode == 1) ? g.cruiseElroySpeed : this.fullSpeed;
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
}