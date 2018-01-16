import GameRes from './GameRes'
import Playfield from './Playfield'
import Actor from './Actor'


import { allPaths, noDotPaths, gameMode, levelConfig, actorMode } from './GameRes'

const oppositeDirections = {
    1: 2, 2: 1, 4: 8, 8: 4
}

let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);
/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        this.playerCount = 1;
        this.speedIntervals = [];
        this.playfieldObj = new Playfield(this);
        this.createActors();
        this.level = 0;
        //this.restartGameplay()
        this.debugFrame = 0;
        this.restart();
    }

    restartGameplay() {
        this.level++;
        this.gameplayModeTime = 0;
        this.intervalTime = 0;
        
        this.levels = this.level >= levelConfig.length ? levelConfig[levelConfig.length - 1] : levelConfig[this.level];
        this.playfieldObj.reset();

        this.restartActors();
        this.switchMainGhostMode(actorMode.RESET, true);
        for (var c = this.playerCount + 1; c < this.playerCount + 4; c++)
            this.actors[c].changeActorMode(16);
    }
    restart(){
        requestAnimationFrame(
            this.loop.bind(this),
            canvas
        )
    }



    //游戏结束后的触摸事件处理逻辑
    touchEventHandler(e) {
        // e.preventDefault()

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

        this.playfieldObj.render(gameRes);
        for (let key in this.actors) {
            this.actors[key].render(gameRes);
        }
    }

    // 游戏逻辑更新主函数
    update() {
        for (let key in this.actors) {
            this.actors[key].update();
        }
    }

    // 实现游戏帧循环
    loop() {
        this.debugFrame++;
        this.intervalTime = (this.intervalTime+1)%60;
        if (this.debugFrame < 30){
            requestAnimationFrame(
                this.loop.bind(this),
                canvas
            )
            return;
        }
        if (this.debugFrame == 30) {
            this.restartGameplay();
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



    ///////////////////////////////////////////////////////////////////////////////////
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

    restartActors() {
        for (let key in this.actors) {
            this.actors[key].resetActor();
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
            // f = g.mainGhostMode;
            // if (b == 4 && g.mainGhostMode != 4) g.lastMainGhostMode = g.mainGhostMode;
            // g.mainGhostMode = b;
            // if (b == 4 || f == 4) g.playAmbientSound();
            // switch (actorMode) {
            //     case 1:
            //     case actorMode.RESET:
            //         this.currentPlayerSpeed = this.levels.playerSpeed * 0.8;
            //         this.currentDotEatingSpeed = this.levels.dotEatingSpeed * 0.8;
            //         break;
            //     // case 4:
            //     //     g.currentPlayerSpeed = g.levels.playerFrightSpeed * 0.8;
            //     //     g.currentDotEatingSpeed = g.levels.dotEatingFrightSpeed * 0.8;
            //     //     g.frightModeTime = g.levels.frightTotalTime;
            //     //     g.modeScoreMultiplier = 1;
            //     //     break
            // }
            for (let k in this.actors) {
                actor = this.actors[k];
                if (actor.ghost) {
                    if (actorMode != 64 && !c)
                        actor.modeChangedWhileInPen = true;
                    if (actorMode == 4)
                        actor.eatenInThisFrightMode = false;
                    if (actor.mode != 8 && actor.mode != 16 && actor.mode != 32 && actor.mode != 128 && actor.mode != 64 || c) {
                        // if (!c && actor.mode != 4 && actor.mode != actorMode) 
                        //     actor.reverseDirectionsNext = true;
                        actor.changeActorMode(actorMode)
                    }
                } else {
                    // actor.fullSpeed = g.currentPlayerSpeed;
                    // actor.dotEatingSpeed = g.currentDotEatingSpeed;
                    // actor.tunnelSpeed = g.currentPlayerSpeed;
                    // actor.d()
                }
            }
        }
    }


    getDistance(b, c) {
        return Math.sqrt((c[1] - b[1]) * (c[1] - b[1]) + (c[0] - b[0]) * (c[0] - b[0]))
    };

    getSpeedIntervals(speed) {
        if (!this.speedIntervals[speed]) {
            var c = 0,
                d = 0;
            this.speedIntervals[speed] = [];
            for (var i = 0; i < 60; i++) {
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
}
