import GameRes from './GameRes'
import Actor from './Actor'


import { allPaths, noDotPaths, gameMode, levelConfig, actorMode } from './GameRes'



let canvas = wx.createCanvas()
let ctx = canvas.getContext('2d')
let gameRes = new GameRes(ctx, canvas.width, canvas.height);
/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        this.playfieldX = 0;
        this.playfieldY = 48;
        this.playerCount = 1;
        this.speedIntervals = [];
        this.determinePlayfieldDimensions()
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
        this.preparePlayfield();
        this.preparePaths();
        this.prepareAllowedDirections();
        this.restartActors();
        this.switchMainGhostMode(actorMode.RESET, true);
        for (var c = this.playerCount + 1; c < this.playerCount + 1; c++)
            this.actors[c].changeActorMode(16);
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
            if (this.actors[key].ghost)
                this.actors[key].render(gameRes);
        }
    }

    // 游戏逻辑更新主函数
    update() {
        for (let key in this.actors) {
            if (this.actors[key].ghost)
                this.actors[key].update();
        }
    }

    // 实现游戏帧循环
    loop() {
        this.debugFrame++;
        this.intervalTime = (this.intervalTime + 1) % 60;
        if (this.debugFrame < 30) {
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
    //playfield///////////////////////////////////////////////////////////////////////////////////////
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
    };

    ////////////////////////////////////////////////////////////////////////////////////////



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
