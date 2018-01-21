import GameRes from './GameRes'
import Actor from './Actor'


import { fruitPos, allPaths, noDotPaths, GAMEMODE, levelConfig, ACTORMODE, times, PEN_LEAVING_FOOD_LIMITS, Energizer } from './GameRes'

const FPS_OPTIONS = [90, 45, 30];
const DEFAULT_FPS = FPS_OPTIONS[0];
//let D = 60;

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);

let PlatformDifference = {
    "ios": {
        touchstart: "ontouchstart",
        touchmove: "ontouchmove",
        touchcancel: "ontouchcancel",
        touchend: "ontouchend"
    },
    "android": {
        touchstart: "ontouchstart",
        touchmove: "ontouchmove",
        touchcancel: "ontouchcancel",
        touchend: "ontouchend"
    },
    "devtools": {
        touchstart: "touchstart",
        touchmove: "touchmove",
        touchcancel: "touchcancel",
        touchend: "touchend"
    }
}

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        this.platform = "devtools";
        this.touchHandler = this.touchEventHandler.bind(this)
        //wx.onTouchMove(this.touchHandler);
        wx.onTouchStart(this.touchHandler);
        wx.onTouchEnd(this.touchHandler);
        wx.onTouchCancel(this.touchHandler);

        this.playfieldX = 0;
        this.playfieldY = 48;

        //this.restartGameplay()
        this.debugFrame = 0;
        this.restart();
    }

    newGame() {
        this.frame = 0;
        this.playerCount = 1;
        this.createActors();
        this.startGameplay();
    }

    startGameplay() {
        this.score = [0, 0];
        this.extraLifeAwarded = [false, false];
        this.lives = 3;
        this.level = 0;
        this.paused = false;
        this.globalTime = 0;
        this.newLevel(true);
    }

    newLevel(b) {
        this.level++;
        this.levels = this.level >= levelConfig.length ? levelConfig[levelConfig.length - 1] : levelConfig[this.level];
        // start issue 14: Ghosts stay blue permanently on restart
        if ((this.levels.frightTime > 0) && (this.levels.frightTime <= 6))
            this.levels.frightTime = Math.round(this.levels.frightTime * DEFAULT_FPS);
        // end issue 14
        this.levels.frightTotalTime = this.levels.frightTime + this.timing[1] * (this.levels.frightBlinkCount * 2 - 1);
        for (var k in this.actors)
            this.actors[k].dotCount = 0;
        this.alternatePenLeavingScheme = false;
        this.lostLifeOnThisLevel = false;
        this.resetPlayfield();
        this.restartGameplay(b);
        //g.level == 256 && g.killScreen()
    }



    restartGameplay(b) {
        this.seed(0);
        this.frightModeTime = 0;
        this.intervalTime = 0;
        this.gameplayModeTime = 0;
        this.fruitTime = 0;
        this.ghostModeSwitchPos = 0;
        this.ghostModeTime = this.levels.ghostModeSwitchTimes[0] * DEFAULT_FPS;
        this.ghostExitingPenNow = false;
        this.ghostEyesCount = 0;
        this.tilesChanged = false;

        this.updateCruiseElroySpeed();
        this.hideFruit();
        this.resetForcePenLeaveTime();
        this.restartActors();
        //g.updateActorPositions();
        this.switchMainGhostMode(ACTORMODE.SCATTER, true);
        for (var c = this.playerCount + 1; c < this.playerCount + 4; c++)
            this.actors[c].changeActorMode(ACTORMODE.IN_PEN);
        //g.dotEatingChannel = [0, 0];
        //g.dotEatingSoundPart = [1, 1];
        //g.clearDotEatingNow();
        b ? this.changeGameplayMode(4) : this.changeGameplayMode(6)

    }
    restart() {
        requestAnimationFrame(
            this.loop.bind(this),
            canvas
        )
    }




    //游戏结束后的触摸事件处理逻辑
    touchEventHandler(e) {
        // e.preventDefault()
        if (e.type == PlatformDifference[this.platform].touchstart) {
            this.touchStartX = e.touches[0].clientX
            this.touchStartY = e.touches[0].clientY
        } else if (e.type == PlatformDifference[this.platform].touchend) {
            let deltaX = e.changedTouches[0].clientX - this.touchStartX;
            let deltaY = e.changedTouches[0].clientY - this.touchStartY;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0.5)//右
                    this.actors[0].requestedDir = 8;
                else if (deltaX < -0.5)//左
                    this.actors[0].requestedDir = 4;
            }
            else {
                if (deltaY > 0.5)//下
                    this.actors[0].requestedDir = 2;
                else if (deltaY < -0.5)//上
                    this.actors[0].requestedDir = 1;
            }

        }
        // let x = e.touches[0].clientX
        // let y = e.touches[0].clientY

        // let area = this.gameinfo.btnArea

        // if (x >= area.startX
        //     && x <= area.endX
        //     && y >= area.startY
        //     && y <= area.endY)
        //     this.restart()
    }

    /**
     * canvas重绘函数
     * 每一帧重新绘制所有的需要展示的元素
     */
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.renderPlayfield(gameRes);
        if (this.fruitShown) {
            gameRes.renderImage(46, fruitPos[1], fruitPos[0] + this.playfieldY, 0, 0);
        }

        for (let key in this.actors) {
            this.actors[key].render(gameRes);
            // ctx.strokeRect(this.actors[key].pos[1] * gameRes.renderRate, (this.actors[key].pos[0]+48) * gameRes.renderRate, 
            //     16 * gameRes.renderRate, 16 * gameRes.renderRate);

        }

        if (this.showReady)
            gameRes.renderImage(4, 114, 189, 1, 1)

        gameRes.renderImage(100, 112, this.playfieldY+32*8);//, canvas.height - 100, 1, 1);
    }







    // 实现游戏帧循环
    loop() {
        this.debugFrame++;
        this.intervalTime = (this.intervalTime + 1) % DEFAULT_FPS;
        if (this.debugFrame < 30) {
            requestAnimationFrame(
                this.loop.bind(this),
                canvas
            )
            return;
        }
        if (this.debugFrame == 30) {
            this.speedIntervals = [];
            this.initializeTickTimer();
            this.newGame();
        }

        this.update()
        this.render()


        // // 游戏结束停止帧循环
        // if (databus.gameOver) {
        //     this.gameinfo.renderGameOver(ctx, databus.score)

        //     this.touchHandler = this.touchEventHandler.bind(this)
        //     canvas.addEventListener('touchstart', this.touchHandler)

        //     return
        // }

        requestAnimationFrame(
            this.loop.bind(this),
            canvas
        )
    }
    // //playfield///////////////////////////////////////////////////////////////////////////////////////
    determinePlayfieldDimensions() {
        this.playfieldWidth = 0;//可移动到的宽度
        this.playfieldHeight = 0;//可移动到的高度
        for (var idx in allPaths) {
            var path = allPaths[idx];
            if (path.w) {
                path = path.x + path.w - 1;
                if (path > this.playfieldWidth)
                    this.playfieldWidth = path
            } else {
                path = path.y + path.h - 1;
                if (path > this.playfieldHeight)
                    this.playfieldHeight = path
            }
        }
        this.playfieldHeight++;
    }

    renderPlayfield(gameRes) {
        gameRes.renderImage(0, this.playfieldX, this.playfieldY);

        for (let y in this.playfield) {
            let fieldy = this.playfield[y];
            for (let x in fieldy) {
                if (fieldy[x].dot == 1) {
                    gameRes.renderImage(2, Number(x) + this.playfieldX, Number(y) + this.playfieldY)
                } else if (fieldy[x].dot == 2) {
                    gameRes.renderImage(11, Number(x) + this.playfieldX, Number(y) + this.playfieldY)
                }
            }
        }


        // //DEBUG
        // //设置描边颜色、填充颜色
        // ctx.strokeStyle = "#ff0000";
        // //ctx.fillStyle = "rgba(0,0,0,0.3)";
        // ctx.fillStyle = "#ffffff"
        // ctx.font = "1px Arial"
        // for (let y in this.playfield) {
        //     let fieldy = this.playfield[y];
        //     for (let x in fieldy) {
        //         let startX = Number(x * gameRes.renderRate);
        //         let startY = Number(y * gameRes.renderRate + 48 * gameRes.renderRate);
        //         if (fieldy[x].path) {
        //             //ctx.strokeRect(startX, startY, 8 * gameRes.renderRate, 8 * gameRes.renderRate);
        //             //ctx.fillText("(" + x + "," + y + ")", startX, startY + 8 * gameRes.renderRate);
        //             if (fieldy[x].allowedDir & 0b1) {//上
        //                 ctx.strokeRect(startX + 4 * gameRes.renderRate, startY, 0, 4 * gameRes.renderRate);

        //             }
        //             if (fieldy[x].allowedDir & 0b10) {//下
        //                 ctx.strokeRect(startX + 4 * gameRes.renderRate, startY + 4 * gameRes.renderRate, 0, 4 * gameRes.renderRate);
        //             }
        //             if (fieldy[x].allowedDir & 0b100) {//左
        //                 ctx.strokeRect(startX, startY + 4 * gameRes.renderRate, 4 * gameRes.renderRate, 0);
        //             }
        //             if (fieldy[x].allowedDir & 0b1000) {//右
        //                 ctx.strokeRect(startX + 4 * gameRes.renderRate, startY + 4 * gameRes.renderRate, 4 * gameRes.renderRate, 0);
        //             }
        //         }
        //     }
        // }
    }


    //初始化地图
    preparePlayfield = function () {
        this.playfield = [];
        for (var h = 0; h <= this.playfieldHeight; h++) {
            this.playfield[h * 8] = [];
            for (var w = 0; w <= this.playfieldWidth; w++) {
                this.playfield[h * 8][w * 8] = {
                    path: 0,
                    dot: 0,
                    intersection: 0
                };
            }
        }
    }


    preparePaths = function () {//解析路径数据
        //给路径上加点,类型
        for (var idx in allPaths) {
            var path = allPaths[idx],
                d = path.type;
            if (path.w) {
                let y = path.y * 8;
                for (let x = path.x * 8; x <= (path.x + path.w - 1) * 8; x += 8) {
                    this.playfield[y][x].path = true;
                    if (this.playfield[y][x].dot == 0) {
                        this.playfield[y][x].dot = 1;
                        this.dotsRemaining++
                    }
                    this.playfield[y][x].type = (!d || x != path.x * 8 && x != (path.x + path.w - 1) * 8 ? d : 0)
                }
                //头尾是交叉路口
                this.playfield[y][path.x * 8].intersection = true;
                this.playfield[y][(path.x + path.w - 1) * 8].intersection = true
            }
            else {
                let x = path.x * 8;
                for (let y = path.y * 8; y <= (path.y + path.h - 1) * 8; y += 8) {
                    if (this.playfield[y][x].path)
                        this.playfield[y][x].intersection = true;
                    this.playfield[y][x].path = true;
                    if (this.playfield[y][x].dot == 0) {
                        this.playfield[y][x].dot = 1;
                        this.dotsRemaining++
                    }
                    this.playfield[y][x].type = (!d || y != path.y * 8 && y != (path.y + path.h - 1) * 8 ? d : 0)
                }
                this.playfield[path.y * 8][x].intersection = true;
                this.playfield[(path.y + path.h - 1) * 8][x].intersection = true
            }
        }
        //去除掉没有点的路径上的点
        for (idx in noDotPaths) {
            var path = noDotPaths[idx]
            if (path.w) {
                for (let x = path.x * 8; x <= (path.x + path.w - 1) * 8; x += 8) {
                    this.playfield[path.y * 8][x].dot = 0;
                    this.dotsRemaining--
                }
            }
            else {
                for (let y = path.y * 8; y <= (path.y + path.h - 1) * 8; y += 8) {
                    this.playfield[y][path.x * 8].dot = 0;
                    this.dotsRemaining--
                }
            }
        }

        for (var k in Energizer) {
            var c = Energizer[k];
            this.playfield[c.y * 8][c.x * 8].dot = 2
        }
    }



    ////////////////////////////////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////////////////////////////////////////
    resetPlayfield() {
        this.dotsRemaining = 0;
        this.dotsEaten = 0;
        // g.playfieldEl.innerHTML = "";
        // g.prepareElement(g.playfieldEl, 256, 0);
        this.determinePlayfieldDimensions();//确定地图宽高
        this.preparePlayfield();//
        this.preparePaths();
        this.prepareAllowedDirections();
        // g.createPlayfieldElements();
        // g.createActorElements()
    };


    createActors() {
        this.actors = [];
        for (let i = 0; i < this.playerCount + 4; ++i) {
            this.actors[i] = new Actor(i, this);
            if (i < this.playerCount) {
                this.actors[i].ghost = false;
            }
            else {
                this.actors[i].ghost = true;
            }
        }
    }




















    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Send a random number from 0 to 1. The reason we're not using Math.random()
     * is that you can't seed it reliably on all the browsers -- and we need
     * random numbers to be repeatable between game plays too allow for patterns
     * etc., and also a consistent kill screen that's procedurally generated.
     * @return {number} Random number from 0 to 1.
     */
    rand() {
        var t32 = 0x100000000;
        var constant = 134775813;
        var x = (constant * this.randSeed + 1);
        return (this.randSeed = x % t32) / t32;
    };
    seed(b) {
        this.randSeed = b
    };

    getDistance(b, c) {
        return Math.sqrt((c[1] - b[1]) * (c[1] - b[1]) + (c[0] - b[0]) * (c[0] - b[0]))
    };

    getPlayfieldX = function (x) {
        return x + 0//-32
    };
    getPlayfieldY = function (y) {
        return y + 0
    };








    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    prepareAllowedDirections() {
        for (var b = 8; b < this.playfieldHeight * 8; b += 8) {
            for (var c = 8; c < this.playfieldWidth * 8; c += 8) {
                this.playfield[b][c].allowedDir = 0;
                if (this.playfield[b - 8][c].path)//上
                    this.playfield[b][c].allowedDir += 1;
                if (this.playfield[b + 8][c].path)//下
                    this.playfield[b][c].allowedDir += 2;
                if (this.playfield[b][c - 8].path)//左
                    this.playfield[b][c].allowedDir += 4;
                if (this.playfield[b][c + 8].path)//右
                    this.playfield[b][c].allowedDir += 8
            }
        }
        this.playfield[14 * 8][0].allowedDir = 12;
        this.playfield[14 * 8][27 * 8].allowedDir = 12;

        this.playfield[14 * 8][-8] = this.playfield[14 * 8][-16] = this.playfield[14 * 8][-24] = {
            path: 1,
            dot: 0,
            intersection: 0,
            allowedDir: 12
        };
        this.playfield[14 * 8][28 * 8] = this.playfield[14 * 8][29 * 8] = this.playfield[14 * 8][30 * 8] = {
            path: 1,
            dot: 0,
            intersection: 0,
            allowedDir: 12
        };
    };


    restartActors() {
        for (let key in this.actors) {
            this.actors[key].resetActor();
        }
    }


    newLife() {
        this.lostLifeOnThisLevel = true;
        this.alternatePenLeavingScheme = true;
        this.alternateDotCount = 0;
        this.lives--;
        //this.updateChromeLives();
        this.lives == -1 ? this.changeGameplayMode(8) : this.restartGameplay(false)
    };


    switchMainGhostMode = function (actorMode, c) {
        if (actorMode == ACTORMODE.FRIGHTENED && this.levels.frightTime == 0)
            for (var k in this.actors) {
                var actor = this.actors[k];
                if (actor.ghost)
                    actor.reverseDirectionsNext = true
            }
        else {
            let oldMode = this.mainGhostMode;
            if (actorMode == ACTORMODE.FRIGHTENED && this.mainGhostMode != ACTORMODE.FRIGHTENED)
                this.lastMainGhostMode = this.mainGhostMode;
            this.mainGhostMode = actorMode;
            if (actorMode == ACTORMODE.FRIGHTENED || oldMode == ACTORMODE.FRIGHTENED)
                this.playAmbientSound();
            switch (actorMode) {
                case ACTORMODE.CHASE://1
                case ACTORMODE.SCATTER://2
                    this.currentPlayerSpeed = this.levels.playerSpeed * 0.8;
                    this.currentDotEatingSpeed = this.levels.dotEatingSpeed * 0.8;
                    break;
                case ACTORMODE.FRIGHTENED://4
                    this.currentPlayerSpeed = this.levels.playerFrightSpeed * 0.8;
                    this.currentDotEatingSpeed = this.levels.dotEatingFrightSpeed * 0.8;
                    this.frightModeTime = this.levels.frightTotalTime;
                    this.modeScoreMultiplier = 1;
                    break
            }
            for (let k in this.actors) {
                actor = this.actors[k];
                if (actor.ghost) {
                    if (actorMode != ACTORMODE.ENTERING_PEN && !c)
                        actor.modeChangedWhileInPen = true;
                    if (actorMode == ACTORMODE.FRIGHTENED)
                        actor.eatenInThisFrightMode = false;
                    if (actor.mode != ACTORMODE.EATEN &&
                        actor.mode != ACTORMODE.IN_PEN &&
                        actor.mode != ACTORMODE.LEAVING_PEN &&
                        actor.mode != ACTORMODE.RE_LEAVING_FROM_PEN &&
                        actor.mode != ACTORMODE.ENTERING_PEN || c) {
                        if (!c && actor.mode != ACTORMODE.FRIGHTENED && actor.mode != actorMode)
                            actor.reverseDirectionsNext = true;
                        actor.changeActorMode(actorMode)
                    }
                } else {
                    actor.fullSpeed = this.currentPlayerSpeed;
                    actor.dotEatingSpeed = this.currentDotEatingSpeed;
                    actor.tunnelSpeed = this.currentPlayerSpeed;
                    actor.updateSpeed()
                }
            }
        }
    }


    figureOutPenLeaving() {
        if (this.alternatePenLeavingScheme) {
            this.alternateDotCount++;
            switch (this.alternateDotCount) {
                case PEN_LEAVING_FOOD_LIMITS[1]:
                    this.actors[g.playerCount + 1].freeToLeavePen = true;
                    break;
                case PEN_LEAVING_FOOD_LIMITS[2]:
                    this.actors[g.playerCount + 2].freeToLeavePen = true;
                    break;
                case PEN_LEAVING_FOOD_LIMITS[3]:
                    if (this.actors[this.playerCount + 3].mode == ACTORMODE.IN_PEN)
                        this.alternatePenLeavingScheme = false;
                    break
            }
        } else if (this.actors[this.playerCount + 1].mode == 16 || this.actors[this.playerCount + 1].mode == 8) {
            this.actors[this.playerCount + 1].dotCount++;
            if (this.actors[this.playerCount + 1].dotCount >= this.levels.penLeavingLimits[1])
                this.actors[this.playerCount + 1].freeToLeavePen = true
        } else if (this.actors[this.playerCount + 2].mode == 16 || this.actors[this.playerCount + 2].mode == 8) {
            this.actors[this.playerCount + 2].dotCount++;
            if (this.actors[this.playerCount + 2].dotCount >= this.levels.penLeavingLimits[2])
                this.actors[this.playerCount + 2].freeToLeavePen = true
        } else if (this.actors[this.playerCount + 3].mode == 16 || this.actors[this.playerCount + 3].mode == 8) {
            this.actors[this.playerCount + 3].dotCount++;
            if (this.actors[this.playerCount + 3].dotCount >= this.levels.penLeavingLimits[3])
                this.actors[this.playerCount + 3].freeToLeavePen = true
        }
    };

    resetForcePenLeaveTime() {
        this.forcePenLeaveTime = this.levels.penForceTime * DEFAULT_FPS
    };

    dotEaten(b, c) {
        this.dotsRemaining--;
        this.dotsEaten++;
        this.actors[b].updateCurrentSpeed(1);
        this.playDotEatingSound(b);
        if (this.playfield[c[0]][c[1]].dot == 2) {
            this.switchMainGhostMode(ACTORMODE.FRIGHTENED, false);
            this.addToScore(50, b)
        } else this.addToScore(10, b);
        this.playfield[c[0]][c[1]].dot = 0;
        this.updateCruiseElroySpeed();
        this.resetForcePenLeaveTime();
        this.figureOutPenLeaving();
        if (this.dotsEaten == 70 || this.dotsEaten == 170)
            this.showFruit();
        this.dotsRemaining == 0 && this.finishLevel();
        this.playAmbientSound()
    };
    getFruitSprite = function (b) {
        var c = b <= 4 ? 128 : 160;
        b = 128 + 16 * ((b - 1) % 4);
        return [c, b]
    };
    getFruitScoreSprite = function (b) {
        var c = 128;
        b = 16 * (b - 1);
        return [c, b]
    };
    eatFruit = function (b) {
        if (this.fruitShown) {
            this.playSound("fruit", 0);
            this.fruitShown = false;
            var c = this.getFruitScoreSprite(this.levels.fruit);
            //g.changeElementBkPos(g.fruitEl, c[0], c[1], a);
            this.fruitTime = this.timing[14];
            this.addToScore(this.levels.fruitScore, b)
        }
    };

    updateActorTargetPositions() {
        for (var b = this.playerCount; b < this.playerCount + 4; b++)
            this.actors[b].updateTargetPos()
    };

    moveActors = function () {
        for (let key in this.actors) {
            this.actors[key].update();
        }
    };

    ghostDies(b, c) {
        this.playSound("eating-ghost", 0);
        this.addToScore(200 * this.modeScoreMultiplier, c);
        this.modeScoreMultiplier *= 2;
        this.ghostBeingEatenId = b;
        this.playerEatingGhostId = c;
        this.changeGameplayMode(GAMEMODE.GHOST_DIED)
    };

    playerDies(b) {
        this.playerDyingId = b;
        this.changeGameplayMode(GAMEMODE.PLAYER_DYING)
    };

    detectCollisions = function () {
        this.tilesChanged = false;
        for (var i = this.playerCount; i < this.playerCount + 4; i++) {
            for (var j = 0; j < this.playerCount; j++) {
                if (this.actors[i].tilePos[0] == this.actors[j].tilePos[0] &&
                    this.actors[i].tilePos[1] == this.actors[j].tilePos[1]) {
                    // If the ghost is blue, Pac-Man eats the ghost...
                    if (this.actors[i].mode == ACTORMODE.FRIGHTENED) {
                        this.ghostDies(i, j);
                        // return here prevents from two ghosts being eaten at the same time
                        return
                    } else {
                        // ...otherwise, the ghost kills Pac-Man
                        if (g.actors[i].mode != ACTORMODE.EATEN &&
                            g.actors[i].mode != ACTORMODE.IN_PEN &&
                            g.actors[i].mode != ACTORMODE.LEAVING_PEN &&
                            g.actors[i].mode != ACTORMODE.RE_LEAVING_FROM_PEN &&
                            g.actors[i].mode != ACTORMODE.ENTERING_PEN)
                            g.playerDies(j)
                    }
                }
            }
        }
    };


    updateCruiseElroySpeed = function () {
        var b = this.levels.ghostSpeed * 0.8;
        if (!this.lostLifeOnThisLevel || this.actors[this.playerCount + 3].mode != ACTORMODE.IN_PEN) {
            var c = this.levels;
            if (this.dotsRemaining < c.elroyDotsLeftPart2)
                b = c.elroySpeedPart2 * 0.8;
            else if (this.dotsRemaining < c.elroyDotsLeftPart1)
                b = c.elroySpeedPart1 * 0.8
        }
        if (b != this.cruiseElroySpeed) {
            this.cruiseElroySpeed = b;
            this.actors[this.playerCount].updateSpeed()
        }
    };
    getSpeedIntervals(speed) {
        if (!this.speedIntervals[speed]) {
            var c = 0,
                d = 0;
            this.speedIntervals[speed] = [];
            for (var i = 0; i < DEFAULT_FPS; i++) {
                c += speed;
                if (Math.floor(c) > d) {
                    this.speedIntervals[speed].push(true);
                    d = Math.floor(c)
                }
                else
                    this.speedIntervals[speed].push(false)
            }
        }
        return this.speedIntervals[speed]
    };

    finishLevel() {
        this.changeGameplayMode(GAMEMODE.LEVEL_BEING_COMPLETED)
    };


    changeGameplayMode(_mode) {
        this.gameplayMode = _mode;
        //if (_mode != 13) {
        //    for (var c = 0; c < g.playerCount + 4; c++)
        //        g.actors[c].b();
        //}
        switch (_mode) {
            case GAMEMODE.ORDINARY_PLAYING://0 游戏开始
                this.playAmbientSound();
                break;
            case GAMEMODE.PLAYER_DYING://2:
                this.stopAllAudio();
                this.gameplayModeTime = this.timing[3];
                break;
            case GAMEMODE.PLAYER_DIED://3:
                this.playerDyingId == 0 ? this.playSound("death", 0) : this.playSound("death-double", 0);
                this.gameplayModeTime = this.timing[4];
                break;
            case GAMEMODE.GAME_RESTARTING://6:
                //g.canvasEl.style.visibility = "hidden";
                this.gameplayModeTime = this.timing[5];
                break;
            case GAMEMODE.GAME_RESTARTED://7
                //    this.stopAllAudio();
                //    g.canvasEl.style.visibility = "";
                //    g.doorEl.style.display = "block";
                //    b = document.createElement("div");
                //    b.id = "pcm-re";
                //    g.prepareElement(b, 160, 0);
                //    g.playfieldEl.appendChild(b);
                g.gameplayModeTime = g.timing[6];
                break;
            case GAMEMODE.NEWGAME_STARTING://4://显示READY!倒计时等待游戏开始
                //g.doorEl.style.display = "block";
                // b = document.createElement("div");
                // b.id = "pcm-re";
                //g.prepareElement(b, 160, 0);
                // g.playfieldEl.appendChild(b);//READY!的字样
                this.showReady = true;
                this.gameplayModeTime = this.timing[7];
                this.stopAllAudio();
                this.playSound("start-music", 0, true);
                break;
            case GAMEMODE.NEWGAME_STARTED://5://减少生命,再倒计时
                this.lives--;
                //g.updateChromeLives();
                this.gameplayModeTime = this.timing[8];
                break;
            case GAMEMODE.GAMEOVER://8
            case GAMEMODE.KILL_SCREEN://14
                // b = document.getElementById("pcm-re");
                // google.dom.remove(b);
                this.stopAllAudio();
                // b = document.createElement("div");
                // b.id = "pcm-go";
                // g.prepareElement(b, 8, 152);
                // g.playfieldEl.appendChild(b);
                this.gameplayModeTime = this.timing[9];
                break;
            case GAMEMODE.LEVEL_BEING_COMPLETED://9
                this.stopAllAudio();
                this.gameplayModeTime = this.timing[10];
                break;
            case GAMEMODE.LEVEL_COMPLETED://10
                // g.doorEl.style.display = "none";
                this.gameplayModeTime = this.timing[11];
                break;
            case GAMEMODE.TRANSITION_INTO_NEXT_SCENE://11
                // g.canvasEl.style.visibility = "hidden";
                this.gameplayModeTime = this.timing[12];
                break;
            case 12:
                // g.playfieldEl.style.visibility = "hidden";
                g.gameplayModeTime = g.timing[13];
                break;
            case GAMEMODE.GHOST_DIED://1
                this.gameplayModeTime = this.timing[2];
                break;
            case GAMEMODE.CUTSCENE://13
                this.startCutscene();
                break
        }
    }

    finishFrightMode() {
        this.switchMainGhostMode(this.lastMainGhostMode, false)
    };

    handleGameplayModeTimer() {
        if (this.gameplayModeTime) {
            this.gameplayModeTime--;
            // switch (this.gameplayMode) {
            //     case 2:
            //     case 3:
            //         for (var b = 0; b < this.playerCount + 4; b++) 
            //             this.actors[b].b();
            //         break;
            //     case 10:
            //         Math.floor(this.gameplayModeTime / (this.timing[11] / 8)) % 2 == 0 ? g.changeElementBkPos(g.playfieldEl, 322, 2, e) : g.changeElementBkPos(g.playfieldEl, 322, 138, e)
            // }
            if (this.gameplayModeTime <= 0) {
                this.gameplayModeTime = 0;
                switch (this.gameplayMode) {
                    case GAMEMODE.GHOST_DIED:
                        this.changeGameplayMode(GAMEMODE.ORDINARY_PLAYING);
                        this.ghostEyesCount++;
                        this.playAmbientSound();
                        //this.actors[this.ghostBeingEatenId].el.className = "pcm-ac";
                        this.actors[this.ghostBeingEatenId].changeActorMode(GAMEMODE.GAMEOVER);
                        var c = false;
                        for (b = this.playerCount; b < this.playerCount + 4; b++)
                            if (this.actors[b].mode == ACTORMODE.FRIGHTENED ||
                                (this.actors[b].mode == ACTORMODE.IN_PEN || this.actors[b].mode == ACTORMODE.RE_LEAVING_FROM_PEN) &&
                                !this.actors[b].eatenInThisFrightMode) {
                                c = true;
                                break
                            }
                        if (c == false) this.finishFrightMode();
                        break;
                    case GAMEMODE.PLAYER_DYING:
                        this.changeGameplayMode(GAMEMODE.PLAYER_DIED);
                        break;
                    case GAMEMODE.PLAYER_DIED:
                        this.newLife();
                        break;
                    case GAMEMODE.NEWGAME_STARTING://4:
                        this.changeGameplayMode(GAMEMODE.NEWGAME_STARTED);
                        break;
                    case GAMEMODE.GAME_RESTARTING:
                        this.changeGameplayMode(GAMEMODE.GAME_RESTARTED);
                        break;
                    case GAMEMODE.GAME_RESTARTED:
                    case GAMEMODE.NEWGAME_STARTED://5
                        this.showReady = false;
                        this.changeGameplayMode(GAMEMODE.ORDINARY_PLAYING);
                        break;
                    case GAMEMODE.GAMEOVER://GAME OVER
                        // b = document.getElementById("pcm-go");
                        // google.dom.remove(b);
                        // google.pacManQuery && google.pacManQuery();
                        break;
                    case GAMEMODE.LEVEL_BEING_COMPLETED:
                        this.changeGameplayMode(GAMEMODE.LEVEL_COMPLETED);
                        break;
                    case GAMEMODE.LEVEL_COMPLETED:
                        this.changeGameplayMode(GAMEMODE.TRANSITION_INTO_NEXT_SCENE);
                        break;
                    case GAMEMODE.TRANSITION_INTO_NEXT_SCENE:
                        if (this.levels.cutsceneId) {
                            this.cutsceneId = this.levels.cutsceneId;
                            this.changeGameplayMode(GAMEMODE.CUTSCENE)
                        } else {
                            // this.canvasEl.style.visibility = "";
                            this.newLevel(false)
                        }
                        break;
                    case 12:
                        // this.playfieldEl.style.visibility = "";
                        // this.canvasEl.style.visibility = "";
                        this.switchToDoubleMode();
                        break
                }
            }
        }
    }

    handleFruitTimer() {
        if (this.fruitTime) {
            this.fruitTime--;
            if (this.fruitTime <= 0)
                this.hideFruit()
        }
    };
    hideFruit() {
        this.fruitShown = false;
    };
    showFruit() {
        this.fruitShown = true;
        this.fruitTime = this.timing[15] + (this.timing[16] - this.timing[15]) * this.rand()
    };

    handleGhostModeTimer = function () {
        if (this.frightModeTime) {
            this.frightModeTime--;
            if (this.frightModeTime <= 0) {
                this.frightModeTime = 0;
                this.finishFrightMode()
            }
        } else if (this.ghostModeTime > 0) {
            this.ghostModeTime--;
            if (this.ghostModeTime <= 0) {
                this.ghostModeTime = 0;
                this.ghostModeSwitchPos++;
                if (this.levels.ghostModeSwitchTimes[this.ghostModeSwitchPos]) {
                    this.ghostModeTime = this.levels.ghostModeSwitchTimes[this.ghostModeSwitchPos] * DEFAULT_FPS;
                    switch (this.mainGhostMode) {
                        case ACTORMODE.SCATTER:
                            this.switchMainGhostMode(ACTORMODE.CHASE, false);
                            break;
                        case ACTORMODE.CHASE:
                            this.switchMainGhostMode(ACTORMODE.SCATTER, false);
                            break
                    }
                }
            }
        }
    };



    handleForcePenLeaveTimer() {
        if (this.forcePenLeaveTime) {
            this.forcePenLeaveTime--;
            if (this.forcePenLeaveTime <= 0) {
                for (var b = 1; b <= 3; b++) {
                    if (this.actors[this.playerCount + b].mode == ACTORMODE.IN_PEN) {
                        this.actors[this.playerCount + b].freeToLeavePen = true;
                        break;
                    }
                }
                this.resetForcePenLeaveTime()
            }
        }
    }
    handleTimers() {
        if (this.gameplayMode == 0) {
            this.handleForcePenLeaveTimer();
            this.handleFruitTimer();
            this.handleGhostModeTimer()
        }
        this.handleGameplayModeTimer()
    };

    extraLife = function (b) {
        this.playSound("extra-life", 0);
        this.extraLifeAwarded[b] = a;
        this.lives++;
        if (this.lives > 5) this.lives = 5;
        //this.updateChromeLives()
    };

    addToScore(b, c) {
        this.score[c] += b;
        !this.extraLifeAwarded[c] && this.score[c] > 1E4 && this.extraLife(c);
        //g.updateChromeScore(c)
    };
    clearDotEatingNow() {
        this.dotEatingNow = [false, false];
        this.dotEatingNext = [false, false]
    };

    playSound(b, c, d) {
        // if (!(!this.soundAvailable || !google.pacManSound || g.paused)) {
        //     d || g.stopSoundChannel(c);
        //     try {
        //         g.flashSoundPlayer.playTrack(b, c)
        //     } catch (f) {
        //         g.soundAvailable = e
        //     }
        // }
    };
    stopAllAudio() {
        // if (g.soundAvailable) {
        //     try {
        //         g.flashSoundPlayer.stopAmbientTrack()
        //     } catch (b) {
        //         g.soundAvailable = e
        //     }
        //     for (var c = 0; c < 5; c++) g.stopSoundChannel(c)
        // }
    };
    playDotEatingSound(b) {
        // if (g.soundAvailable && google.pacManSound) if (g.gameplayMode == 0) if (g.dotEatingNow[b]) g.dotEatingNext[b] = a;
        // else {
        //     if (b == 0) {
        //         var c = g.dotEatingSoundPart[b] == 1 ? "eating-dot-1" : "eating-dot-2";
        //         g.playSound(c, 1 + g.dotEatingChannel[b], a);
        //         g.dotTimer = window.setInterval(g.repeatDotEatingSoundPacMan, 150)
        //     } else {
        //         g.playSound("eating-dot-double", 3 + g.dotEatingChannel[b], a);
        //         g.dotTimerMs = window.setInterval(g.repeatDotEatingSoundMsPacMan, 150)
        //     }
        //     g.dotEatingChannel[b] = (g.dotEatingChannel[b] + 1) % 2;
        //     g.dotEatingSoundPart[b] =
        //         3 - g.dotEatingSoundPart[b]
        // }
    };

    repeatDotEatingSound(b) {
        // g.dotEatingNow[b] = e;
        // if (g.dotEatingNext[b]) {
        //     g.dotEatingNext[b] = e;
        //     g.playDotEatingSound(b)
        // }
    };

    repeatDotEatingSoundPacMan = function () {
        this.repeatDotEatingSound(0)
    };
    repeatDotEatingSoundMsPacMan = function () {
        this.repeatDotEatingSound(1)
    };
    playAmbientSound = function () {
        // if (g.soundAvailable && google.pacManSound) {
        //     var b = 0;
        //     if (g.gameplayMode == 0 || g.gameplayMode == 1) b = g.ghostEyesCount ? "ambient-eyes" : g.mainGhostMode == 4 ? "ambient-fright" : g.dotsEaten > 241 ? "ambient-4" : g.dotsEaten > 207 ? "ambient-3" : g.dotsEaten > 138 ? "ambient-2" : "ambient-1";
        //     else if (g.gameplayMode == 13) b = "cutscene";
        //     if (b) try {
        //         g.flashSoundPlayer.playAmbientTrack(b)
        //     } catch (c) {
        //         g.soundAvailable = e
        //     }
        // }
    };

    // initializeTickTimer() {
    //     //window.clearInterval(g.tickTimer);
    //     this.fps = C[this.fpsChoice];
    //     this.tickInterval = 1E3 / g.fps;//计时器的时间间隔
    //     //g.tickMultiplier = D / g.fps;
    //     g.timing = {};
    //     for (var b in w) {
    //         var c = !google.pacManSound && (b == 7 || b == 8) ? 1 : w[b];
    //         g.timing[b] = Math.round(c * D)
    //     }
    //     //g.lastTime = (new Date).getTime();
    //     //g.lastTimeDelta = 0;
    //     //g.lastTimeSlownessCount = 0;
    //     g.tickTimer = window.setInterval(g.tick, g.tickInterval)
    // };


    initializeTickTimer() {
        // window.clearInterval(g.tickTimer);
        // g.fps = C[g.fpsChoice];
        // g.tickInterval = 1E3 / g.fps;//计时器的时间间隔
        //g.tickMultiplier = DEFAULT_FPS / g.fps;
        this.timing = {};
        for (var b in times) {
            var c = times[b];
            this.timing[b] = Math.round(c * DEFAULT_FPS)
        }
        //g.lastTime = (new Date).getTime();
        //g.lastTimeDelta = 0;
        //g.lastTimeSlownessCount = 0;
        // g.tickTimer = window.setInterval(g.tick, g.tickInterval)
    };

    // 游戏逻辑更新主函数
    update() {
        if (this.gameplayMode == GAMEMODE.CUTSCENE) {
            // for (b = 0; b < g.tickMultiplier + c; b++) {
            //     g.advanceCutscene();
            //     g.intervalTime = (g.intervalTime + 1) % DEFAULT_FPS;
            //     g.globalTime++
            // }
            // g.checkCutscene();
            // g.blinkScoreLabels()
        }
        else {
            this.frame++;
            this.moveActors();
            if (this.gameplayMode == 0) {
                if (this.tilesChanged) {
                    //g.detectCollisions();
                    this.updateActorTargetPositions()
                }
            }
        }
        this.handleTimers();
    }

















}
