
import { levelConfig, actorInitial, axisIncrement, actorMode, allDirection, tunneLadit, penExit } from './GameRes'

export default class Actor {
    constructor(id, mainRef) {
        this.id = id;
        this.mainRef = mainRef;
    }

    resetActor(config) {
        let b = actorInitial[this.id];
        this.pos = [b.x * 8, b.y * 8];
        this.tilePos = [b.y * 8, b.x * 8];
        this.lastActiveDir = this.dir = b.dir;
        this.currentSpeed = 0;
        this.physicalSpeed = 0;
        this.updateSpeed(0);
    }

    update() {
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
        gameRes.renderImage(3, this.pos[0] + 4, this.pos[1] + 4, 1, 1);
    }


    ///////////////////////////////////////////////////////////

    // // m() {
    // //     var b = A[this.routineToFollow][this.routineMoveId];
    // //     if (b) {
    // //         if (this.speedIntervals[g.intervalTime]) {
    // //             var c = directionIncrement[this.dir];
    // //             this.pos[c.axis] += c.increment;
    // //             switch (this.dir) {
    // //                 case 1:
    // //                 case 4:
    // //                     if (this.pos[c.axis] < b.dest * 8) {
    // //                         this.pos[c.axis] = b.dest * 8;
    // //                         this.proceedToNextRoutineMove = a
    // //                     }
    // //                     break;
    // //                 case 2:
    // //                 case 8:
    // //                     if (this.pos[c.axis] > b.dest * 8) {
    // //                         this.pos[c.axis] = b.dest * 8;
    // //                         this.proceedToNextRoutineMove = a
    // //                     }
    // //                     break
    // //             }
    // //             this.b()
    // //         }
    // //     }
    // // };
    specialField() {//特殊位置的操作 n
        //在隧道
        if (this.pos[0] == tunneLadit[0].x * 8 && this.pos[1] == tunneLadit[0].y * 8) {
            this.pos[1] = tunneLadit[1].y * 8;
            this.pos[0] = (tunneLadit[1].x - 1) * 8
        } else if (this.pos[0] == tunneLadit[1].y * 8 && this.pos[1] == tunneLadit[1].x * 8) {
            this.pos[0] = tunneLadit[0].y * 8;
            this.pos[1] = (tunneLadit[0].x + 1) * 8
        }

        this.mode == actorMode.WAIT &&
            this.pos[0] == penExit[0] &&
            this.pos[1] == penExit[1] &&
            this.changeActorMode(64);//怪物出门
        // if (this.ghost == false && this.pos[0] == v[0] && (this.pos[1] == v[1] || this.pos[1] == v[1] + 8))
        //     g.eatFruit(this.id)
    };


    applyNextDir() {//u
        this.specialField();
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
        // this.ghost==false &&
        //     this.nextDir &&
        //     g.playfield[d[0]][d[1]].intersection &&
        //     this.nextDir & g.playfield[d[0]][d[1]].allowedDir &&
        //     this.t()
    };

    updateTilePos(b) {
        this.mainRef.tilesChanged = true;
        if (this.reverseDirectionsNext) {
            this.dir = g.oppositeDirections[this.dir];
            this.nextDir = 0;
            this.reverseDirectionsNext = false;
            this.updateNextDir(true)
        }
        // if (this.ghost == false && mainRef.playfield[b[0]][b[1]].path == false) {
        //     this.pos[0] = this.lastGoodTilePos[0];
        //     this.pos[1] = this.lastGoodTilePos[1];
        //     b[0] = this.lastGoodTilePos[0];
        //     b[1] = this.lastGoodTilePos[1];
        //     this.dir = 0
        // }
        // else
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
                    if ((this.dir & field.allowedDir) == 0 && field.allowedDir == g.oppositeDirections[this.dir]) //死路 需要回头
                        this.nextDir = this.mainRef.oppositeDirections[this.dir];
                    else {
                        let minDist = 99999999999;
                        let bestDir = 0;
                        for (var k in allDirection) {//从所有可走的方向中找出离目标点最近的方向
                            var dir = allDirection[k];
                            if (h.allowedDir & dir && this.dir != g.oppositeDirections[dir]) {
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
                    if ((this.dir & field.allowedDir) == 0 && field.allowedDir == g.oppositeDirections[this.dir])//死路 需要回头
                        this.nextDir = this.mainRef.oppositeDirections[this.dir];
                    else {
                        do randDir = allDirection[Math.floor(this.mainRef.rand() * 4)];
                        while ((randDir & h.allowedDir) == 0 || randDir == g.oppositeDirections[this.dir]);
                        this.nextDir = f
                    }
                    break
            }
        }
    };



    changeActorMode(newMode) {
        this.mode = newMode;
        switch (newMode) {
            case actorMode.RESET://回到固定目标点上
                this.targetPos = this.scatterPos;
                this.fullSpeed = this.mainRef.levels.ghostSpeed * 0.8;
                this.tunnelSpeed = this.mainRef.levels.ghostTunnelSpeed * 0.8;
                this.followingRoutine = false;
                break;
            case actorMode.WAIT://0b00001000://在围栏(pen)里徘徊
                this.tunnelSpeed = this.fullSpeed = 1.6;
                this.targetPos = [s[0], s[1]];
                this.freeToLeavePen = this.followingRoutine = false;
                break;
            case 0b00010000://16
                this.updateTargetPlayerId();
                this.routineMoveId = -1;
                this.followingRoutine = true;
                break;
        }
        this.updateSpeed();
    }

    //设置怪物的目标玩家id(针对多个玩家时)
    updateTargetPlayerId = function () {
        if (this.id >= this.playerCount)
            this.targetPlayerId = 0//Math.floor(g.rand() * g.playerCount)
    };

    updateSpeed(_speed) {
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
    };
}