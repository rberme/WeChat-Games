
import {
    ACTORMODE,
    GAMEMODE,
    PM_DIRECTION,
    BLOCKSIZE,
    LEVELCONFIG,
} from "./Misc/GameRes"

import GameRes from "./Misc/GameRes"
import WorldMap from './Misc/WorldMap'
import Player from './Misc/Player'
import TileCollide from './Misc/TileCollide'
import Ghost from './Ghosts/Ghost'

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

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);
let tileCollide = new TileCollide();

const DEFAULT_FPS = 60;
/**
 * 游戏主函数
 */

export default class Main {
    constructor() {
        this.platform = "devtools";//"ios";//
        this.touchHandler = this.touchEventHandler.bind(this)
        wx.onTouchStart(this.touchHandler);
        wx.onTouchEnd(this.touchHandler);
        wx.onTouchCancel(this.touchHandler);
        this.gameplayMode = GAMEMODE.KILL_SCREEN;
        this.restart()
    }

    killScreen(is256) {

    }

    newGame() {
        this.frame = 0;
        this.playerCount = 1;
        this.createActors();
        this.startGameplay();
    }

    createActors() {
        this.worldMap = new WorldMap(this);
        this.mapAdj = this.worldMap.adjFun.bind(this.worldMap);
        this.playerCount = 1;
        this.player = new Player(this);
        this.actors = [];
        for (let i = 0; i < 4; ++i) {
            this.actors.push(new Ghost(i + this.playerCount, this));
        }
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

    newLevel(newStart) {
        this.level++;
        this.levels = this.level >= LEVELCONFIG.length ? LEVELCONFIG[LEVELCONFIG.length - 1] : LEVELCONFIG[this.level];
        // start issue 14: Ghosts stay blue permanently on restart
        if ((this.levels.frightTime > 0) && (this.levels.frightTime <= 6))
            this.levels.frightTime = Math.round(this.levels.frightTime * DEFAULT_FPS);
        // end issue 14
        this.levels.frightTotalTime = this.levels.frightTime + this.timing[1] * (this.levels.frightBlinkCount * 2 - 1);
        // for (var k in this.actors)
        //     this.actors[k].dotCount = 0;
        this.player.dotCount = 0;
        this.alternatePenLeavingScheme = false;
        this.lostLifeOnThisLevel = false;
        this.resetPlayfield();
        this.restartGameplay(newStart);
        //g.level == 256 && g.killScreen()
    }

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
    restartGameplay(newStart) {
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

        //this.updateCruiseElroySpeed();
        //this.hideFruit();
        this.resetForcePenLeaveTime();
        this.restartActors();
        //g.updateActorPositions();
        this.switchMainGhostMode(ACTORMODE.SCATTER, true);
        for (var c = 1; c < 4; c++)
            this.actors[c].changeActorMode(ACTORMODE.IN_PEN);
        //g.dotEatingChannel = [0, 0];
        //g.dotEatingSoundPart = [1, 1];
        //g.clearDotEatingNow();
        newStart ? this.changeGameplayMode(GAMEMODE.NEWGAME_STARTING) : this.changeGameplayMode(GAMEMODE.GAME_RESTARTING)
        //this.changeGameplayMode(GAMEMODE.CUTSCENE);

    }
    resetForcePenLeaveTime() {
        this.forcePenLeaveTime = this.levels.penForceTime * DEFAULT_FPS
    };
    restartActors() {
        for (let key in this.actors) {
            this.actors[key].resetActor();
        }
        this.player.resetPlayer();
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
                    this.player.requestDir = 8;
                else if (deltaX < -0.5)//左
                    this.player.requestDir = 4;
            }
            else {
                if (deltaY > 0.5)//下
                    this.player.requestDir = 2;
                else if (deltaY < -0.5)//上
                    this.player.requestDir = 1;
            }

        }
    }

    restart() {



        requestAnimationFrame(
            this.loop.bind(this),
            canvas
        )
    }





    render() {
        //ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.worldMap.render(gameRes);
        this.player.render(gameRes);
        for (let k in this.actors) {
            this.actors[k].render(gameRes);
        }
    }

    handleForcePenLeaveTimer() {
        if (this.forcePenLeaveTime) {
            this.forcePenLeaveTime--;
            if (this.forcePenLeaveTime <= 0) {
                for (var b = 1; b <= 3; b++) {
                    if (this.actors[b].mode == ACTORMODE.IN_PEN) {
                        this.actors[b].freeToLeavePen = true;
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
            //this.handleFruitTimer();
            //this.handleGhostModeTimer()
        }
        this.handleGameplayModeTimer()
    };
    // 游戏逻辑更新主函数
    update() {
        for (let k in this.actors) {
            this.actors[k].update();
        }


        let halfBLOCKSIZE = (BLOCKSIZE >> 1);
        this.player.pos = tileCollide.Move2(this.player, 1.2, this.mapAdj);
        let mapWidth = (this.worldMap.playfieldWidth + 1) * BLOCKSIZE;
        if (this.player.pos[0] < -halfBLOCKSIZE && this.player.dir == 4)
            this.player.pos[0] += mapWidth + halfBLOCKSIZE;
        else if (this.player.pos[0] > mapWidth + halfBLOCKSIZE && this.player.dir == 8)
            this.player.pos[0] -= (mapWidth + halfBLOCKSIZE);
        this.player.update();


        if (this.gameplayMode == 0) {
            if (this.tilesChanged) {
                //this.detectCollisions();
                this.updateActorTargetPositions()
            }
        }
    }

    // 实现游戏帧循环
    loop() {
        this.frame++;
        if (this.frame >= 100) {
            this.update()
            this.render()
        }

        // // 游戏结束停止帧循环
        // if (databus.gameOver) {
        //     this.gameinfo.renderGameOver(ctx, databus.score)
        //     return
        // }

        requestAnimationFrame(
            this.loop.bind(this),
            canvas
        )
    }


    switchMainGhostMode(actorMode, c) {
        if (actorMode == ACTORMODE.FRIGHTENED && this.levels.frightTime == 0)//惊吓状态结束,掉头
            for (var k in this.actors) {
                var actor = this.actors[k];
                actor.reverseDirectionsNext = true
            }
        else {
            let oldMode = this.mainGhostMode;
            if (actorMode == ACTORMODE.FRIGHTENED && this.mainGhostMode != ACTORMODE.FRIGHTENED)
                this.lastMainGhostMode = this.mainGhostMode;
            this.mainGhostMode = actorMode;
            // if (actorMode == ACTORMODE.FRIGHTENED || oldMode == ACTORMODE.FRIGHTENED)
            //     this.playAmbientSound();
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
                //if (actor.ghost) {
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
                // } else {
                //     actor.fullSpeed = this.currentPlayerSpeed;
                //     actor.dotEatingSpeed = this.currentDotEatingSpeed;
                //     actor.tunnelSpeed = this.currentPlayerSpeed;
                //     actor.updateSpeed()
                // }
            }
        }
    }


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

    updateActorTargetPositions() {
        for (var b in this.actors)
            this.actors[b].updateTargetPos()
    };
}
