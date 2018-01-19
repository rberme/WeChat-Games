import GameRes from './GameRes'
import Actor from './Actor'


import { allPaths, noDotPaths, gameMode, levelConfig, actorMode, times, dotCount } from './GameRes'

let D = 60;

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
            this.levels.frightTime = Math.round(this.levels.frightTime * D);
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
        this.ghostModeTime = this.levels.ghostModeSwitchTimes[0] * D;
        this.ghostExitingPenNow = false;
        this.ghostEyesCount = 0;
        this.tilesChanged = false;

        this.updateCruiseElroySpeed();
        //g.hideFruit();
        this.resetForcePenLeaveTime();
        this.restartActors();
        //g.updateActorPositions();
        this.switchMainGhostMode(actorMode.RESET, true);
        for (var c = this.playerCount + 1; c < this.playerCount + 4; c++)
            this.actors[c].changeActorMode(actorMode.WAIT);
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
                    this.actors[0].requestedDir = 2;
                else if (deltaX < -0.5)//左
                    this.actors[0].requestedDir = 1;
            }
            else {
                if (deltaY > 0.5)//下
                    this.actors[0].requestedDir = 8;
                else if (deltaY < -0.5)//上
                    this.actors[0].requestedDir = 4;
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
        for (let key in this.actors) {
            //if (this.actors[key].ghost) 
            this.actors[key].render(gameRes);
            // ctx.strokeRect(this.actors[key].pos[1] * gameRes.renderRate, (this.actors[key].pos[0]+48) * gameRes.renderRate, 
            //     16 * gameRes.renderRate, 16 * gameRes.renderRate);

        }

        if (this.showReady)
            gameRes.renderImage(4, 114, 189, 1, 1)
    }

    moveActors = function () {
        for (let key in this.actors) {
            //if (this.actors[key].ghost)
            this.actors[key].update();
        }
    };

    updateActorTargetPositions() {
        for (var b = this.playerCount; b < this.playerCount + 4; b++)
            this.actors[b].updateTargetPos()
    };

    // 游戏逻辑更新主函数
    update() {
        if (this.gameplayMode == 13) {
            // for (b = 0; b < g.tickMultiplier + c; b++) {
            //     g.advanceCutscene();
            //     g.intervalTime = (g.intervalTime + 1) % D;
            //     g.globalTime++
            // }
            // g.checkCutscene();
            // g.blinkScoreLabels()
        }
        else {
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

    // 实现游戏帧循环
    loop() {
        this.debugFrame++;
        this.intervalTime = (this.intervalTime + 1) % D;
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
                if (fieldy[x].dot > 0) {
                    gameRes.renderImage(2, Number(x) + this.playfieldX, Number(y) + this.playfieldY)
                }
            }
        }


        //DEBUG
        //设置描边颜色、填充颜色
        ctx.strokeStyle = "#ff0000";
        //ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillStyle = "#ffffff"
        ctx.font = "1px Arial"
        for (let y in this.playfield) {
            let fieldy = this.playfield[y];
            for (let x in fieldy) {
                let startX = Number(x * gameRes.renderRate);
                let startY = Number(y * gameRes.renderRate + 48 * gameRes.renderRate);
                if (fieldy[x].path) {
                    //ctx.strokeRect(startX, startY, 8 * gameRes.renderRate, 8 * gameRes.renderRate);
                    //ctx.fillText("(" + x + "," + y + ")", startX, startY + 8 * gameRes.renderRate);
                    if (fieldy[x].allowedDir & 0b1) {//上
                        ctx.strokeRect(startX + 4 * gameRes.renderRate, startY, 0, 4 * gameRes.renderRate);

                    }
                    if (fieldy[x].allowedDir & 0b10) {//下
                        ctx.strokeRect(startX + 4 * gameRes.renderRate, startY + 4 * gameRes.renderRate, 0, 4 * gameRes.renderRate);
                    }
                    if (fieldy[x].allowedDir & 0b100) {//左
                        ctx.strokeRect(startX, startY + 4 * gameRes.renderRate, 4 * gameRes.renderRate, 0);
                    }
                    if (fieldy[x].allowedDir & 0b1000) {//右
                        ctx.strokeRect(startX + 4 * gameRes.renderRate, startY + 4 * gameRes.renderRate, 4 * gameRes.renderRate, 0);
                    }
                }
            }
        }
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


    switchMainGhostMode = function (actorMode, c) {
        if (actorMode == 4 && this.levels.frightTime == 0) {
            for (var k in this.actors) {
                var actor = this.actors[k];
                if (actor.ghost)
                    actor.reverseDirectionsNext = true
            }
        } else {
            let oldMode = this.mainGhostMode;
            if (actorMode == 4 && this.mainGhostMode != 4)
                this.lastMainGhostMode = this.mainGhostMode;
            this.mainGhostMode = actorMode;
            // if (actorMode == 4 || oldMode == 4) 
            //     this.playAmbientSound();
            switch (actorMode) {
                case 1:
                case actorMode.RESET://2
                    this.currentPlayerSpeed = this.levels.playerSpeed * 0.8;
                    this.currentDotEatingSpeed = this.levels.dotEatingSpeed * 0.8;
                    break;
                case 4:
                    this.currentPlayerSpeed = this.levels.playerFrightSpeed * 0.8;
                    this.currentDotEatingSpeed = this.levels.dotEatingFrightSpeed * 0.8;
                    this.frightModeTime = this.levels.frightTotalTime;
                    this.modeScoreMultiplier = 1;
                    break
            }
            for (let k in this.actors) {
                actor = this.actors[k];
                if (actor.ghost) {
                    if (actorMode != 64 && !c)
                        actor.modeChangedWhileInPen = true;
                    if (actorMode == 4)
                        actor.eatenInThisFrightMode = false;
                    if (actor.mode != 8 && actor.mode != 16 && actor.mode != 32 && actor.mode != 128 && actor.mode != 64 || c) {
                        if (!c && actor.mode != 4 && actor.mode != actorMode)
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


    newLife() {
        this.lostLifeOnThisLevel = true;
        this.alternatePenLeavingScheme = true;
        this.alternateDotCount = 0;
        this.lives--;
        //this.updateChromeLives();
        this.lives == -1 ? this.changeGameplayMode(8) : this.restartGameplay(false)
    };



    getSpeedIntervals(speed) {
        if (!this.speedIntervals[speed]) {
            var c = 0,
                d = 0;
            this.speedIntervals[speed] = [];
            for (var i = 0; i < D; i++) {
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

    resetForcePenLeaveTime() {
        this.forcePenLeaveTime = this.levels.penForceTime * D
    };

    handleForcePenLeaveTimer() {
        if (this.forcePenLeaveTime) {
            this.forcePenLeaveTime--;
            if (this.forcePenLeaveTime <= 0) {
                for (var b = 1; b <= 3; b++) {
                    if (this.actors[this.playerCount + b].mode == actorMode.WAIT) {
                        this.actors[this.playerCount + b].freeToLeavePen = true;
                        break;
                    }
                }
                this.resetForcePenLeaveTime()
            }
        }
    }

    finishFrightMode = function () {
        this.switchMainGhostMode(this.lastMainGhostMode, false)
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
                    this.ghostModeTime = this.levels.ghostModeSwitchTimes[this.ghostModeSwitchPos] * D;
                    switch (this.mainGhostMode) {
                        case 2:
                            this.switchMainGhostMode(1, false);
                            break;
                        case 1:
                            this.switchMainGhostMode(2, false);
                            break
                    }
                }
            }
        }
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
                    // case 1:
                    //     g.changeGameplayMode(0);
                    //     g.ghostEyesCount++;
                    //     g.playAmbientSound();
                    //     g.actors[g.ghostBeingEatenId].el.className = "pcm-ac";
                    //     g.actors[g.ghostBeingEatenId].changeActorMode(8);
                    //     var c = e;
                    //     for (b = g.playerCount; b < g.playerCount + 4; b++) if (g.actors[b].mode == 4 || (g.actors[b].mode == 16 || g.actors[b].mode == 128) && !g.actors[b].eatenInThisFrightMode) {
                    //         c = a;
                    //         break
                    //     }
                    //     c || g.finishFrightMode();
                    //     break;
                    // case 2:
                    //     g.changeGameplayMode(3);
                    //     break;
                    // case 3:
                    //     g.newLife();
                    //     break;
                    case gameMode.READY://4:
                        this.changeGameplayMode(5);
                        break;
                    // case 6:
                    //     g.changeGameplayMode(7);
                    //     break;
                    // case 7:
                    case gameMode.DEDUCTLIVE://5
                        this.showReady = false;
                        this.changeGameplayMode(0);
                        break;
                    case 8://GAME OVER
                        // b = document.getElementById("pcm-go");
                        // google.dom.remove(b);
                        // google.pacManQuery && google.pacManQuery();
                        break;
                    // case 9:
                    //     g.changeGameplayMode(10);
                    //     break;
                    // case 10:
                    //     g.changeGameplayMode(11);
                    //     break;
                    // case 11:
                    //     if (g.levels.cutsceneId) {
                    //         g.cutsceneId = g.levels.cutsceneId;
                    //         g.changeGameplayMode(13)
                    //     } else {
                    //         g.canvasEl.style.visibility = "";
                    //         g.newLevel(e)
                    //     }
                    //     break;
                    // case 12:
                    //     g.playfieldEl.style.visibility = "";
                    //     g.canvasEl.style.visibility = "";
                    //     g.switchToDoubleMode();
                    //     break
                }
            }
        }
    }
    handleTimers() {
        if (this.gameplayMode == 0) {
            this.handleForcePenLeaveTimer();
            // this.handleFruitTimer();
            this.handleGhostModeTimer()
        }
        this.handleGameplayModeTimer()
    };

    changeGameplayMode(_mode) {
        this.gameplayMode = _mode;
        switch (_mode) {
            case 0://游戏开始
                //g.playAmbientSound();
                break;
            case gameMode.READY://4://显示READY!倒计时等待游戏开始
                //g.doorEl.style.display = "block";
                // b = document.createElement("div");
                // b.id = "pcm-re";
                //g.prepareElement(b, 160, 0);
                // g.playfieldEl.appendChild(b);//READY!的字样
                this.showReady = true;
                this.gameplayModeTime = this.timing[7];
                // g.stopAllAudio();
                // g.playSound("start-music", 0, true);
                break;
            case gameMode.DEDUCTLIVE://5://减少生命,再倒计时
                this.lives--;
                //g.updateChromeLives();
                this.gameplayModeTime = this.timing[8];
                break;
        }
    }

    initializeTickTimer() {
        // window.clearInterval(g.tickTimer);
        // g.fps = C[g.fpsChoice];
        // g.tickInterval = 1E3 / g.fps;//计时器的时间间隔
        //g.tickMultiplier = D / g.fps;
        this.timing = {};
        for (var b in times) {
            var c = times[b];
            this.timing[b] = Math.round(c * D)
        }
        //g.lastTime = (new Date).getTime();
        //g.lastTimeDelta = 0;
        //g.lastTimeSlownessCount = 0;
        // g.tickTimer = window.setInterval(g.tick, g.tickInterval)
    };


    dotEaten(b, c) {
        this.dotsRemaining--;
        this.dotsEaten++;
        this.actors[b].updateSpeed(1);
        //g.playDotEatingSound(b);
        if (this.playfield[c[0]][c[1]].dot == 2) {
            this.switchMainGhostMode(4, e);
            this.addToScore(50, b)
        } else this.addToScore(10, b);
        this.playfield[c[0]][c[1]].dot = 0;
        this.updateCruiseElroySpeed();
        this.resetForcePenLeaveTime();
        this.figureOutPenLeaving();
        if (this.dotsEaten == 70 || this.dotsEaten == 170) this.showFruit();
        this.dotsRemaining == 0 && this.finishLevel();
        //g.playAmbientSound()
    };

    addToScore(b, c) {
        this.score[c] += b;
        !this.extraLifeAwarded[c] && this.score[c] > 1E4 && this.extraLife(c);
        //g.updateChromeScore(c)
    };
    extraLife = function (b) {
        //this.playSound("extra-life", 0);
        this.extraLifeAwarded[b] = a;
        this.lives++;
        if (this.lives > 5) this.lives = 5;
        //this.updateChromeLives()
    };
    figureOutPenLeaving() {
        if (this.alternatePenLeavingScheme) {
            this.alternateDotCount++;
            switch (this.alternateDotCount) {
                case dotCount[1]:
                    this.actors[g.playerCount + 1].freeToLeavePen = true;
                    break;
                case dotCount[2]:
                    this.actors[g.playerCount + 2].freeToLeavePen = true;
                    break;
                case dotCount[3]:
                    if (this.actors[this.playerCount + 3].mode == 16)
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


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    rand() {
        var b = 4294967296,
            c = 134775813;
        c = c * this.randSeed + 1;
        return (this.randSeed = c % b) / b
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

        this.playfield[14 * 8][-8] = this.playfield[14 * 8][-16] =  {
            path: 0,
            dot: 0,
            intersection: 0,
            allowedDir: 12
        };
        this.playfield[14 * 8][28 * 8] = this.playfield[14 * 8][29 * 8] = {
            path: 0,
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


    updateCruiseElroySpeed = function () {
        var b = this.levels.ghostSpeed * 0.8;
        if (!this.lostLifeOnThisLevel || this.actors[this.playerCount + 3].mode != 16) {
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
























































}
