
import TileCollide from "./TileCollide"
import {
    ALLPATHS,
    ALTASRECT,
    NODOTPATHS,
    ACTORMODE,
    GAMEMODE,
    ENERGIZER,
    BLOCKSIZE,
} from "./GameRes"


export default class WorldMap {
    constructor(mainRef) {
        this.mainRef = mainRef;
        this.playfieldX = 0;
        this.playfieldY = 42;
    }

    determinePlayfieldDimensions() {
        this.playfieldWidth = 0;//可移动到的宽度
        this.playfieldHeight = 0;//可移动到的高度
        for (var idx in ALLPATHS) {
            var path = ALLPATHS[idx];
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
    //初始化地图
    preparePlayfield = function () {
        this.playfield = [];
        for (var h = 0; h <= this.playfieldHeight; h++) {
            this.playfield[h * BLOCKSIZE] = [];
            for (var w = 0; w <= this.playfieldWidth; w++) {
                this.playfield[h * BLOCKSIZE][w * BLOCKSIZE] = {
                    path: 0,
                    dot: 0,
                    intersection: 0
                };
            }
        }
    }

    preparePaths() {//解析路径数据
        //给路径上加点,类型
        for (var idx in ALLPATHS) {
            var path = ALLPATHS[idx]//,
                //d = path.type;
            if (path.w) {
                let y = path.y * BLOCKSIZE;
                for (let x = path.x * BLOCKSIZE; x <= (path.x + path.w - 1) * BLOCKSIZE; x += BLOCKSIZE) {
                    this.playfield[y][x].path = true;
                    if (this.playfield[y][x].dot == 0) {
                        this.playfield[y][x].dot = 1;
                        this.dotsRemaining++
                    }
                    //this.playfield[y][x].type = (!d || x != path.x * BLOCKSIZE && x != (path.x + path.w - 1) * BLOCKSIZE ? d : 0)
                }
                //头尾是交叉路口
                this.playfield[y][path.x * BLOCKSIZE].intersection = true;
                this.playfield[y][(path.x + path.w - 1) * BLOCKSIZE].intersection = true
            }
            else {
                let x = path.x * BLOCKSIZE;
                for (let y = path.y * BLOCKSIZE; y <= (path.y + path.h - 1) * BLOCKSIZE; y += BLOCKSIZE) {
                    if (this.playfield[y][x].path)
                        this.playfield[y][x].intersection = true;
                    this.playfield[y][x].path = true;
                    if (this.playfield[y][x].dot == 0) {
                        this.playfield[y][x].dot = 1;
                        this.dotsRemaining++
                    }
                    //this.playfield[y][x].type = (!d || y != path.y * BLOCKSIZE && y != (path.y + path.h - 1) * BLOCKSIZE ? d : 0)
                }
                this.playfield[path.y * BLOCKSIZE][x].intersection = true;
                this.playfield[(path.y + path.h - 1) * BLOCKSIZE][x].intersection = true
            }
        }
        //去除掉没有点的路径上的点
        for (idx in NODOTPATHS) {
            var path = NODOTPATHS[idx]
            if (path.w) {
                for (let x = path.x * BLOCKSIZE; x <= (path.x + path.w - 1) * BLOCKSIZE; x += BLOCKSIZE) {
                    this.playfield[path.y * BLOCKSIZE][x].dot = 0;
                    this.dotsRemaining--
                }
            }
            else {
                for (let y = path.y * BLOCKSIZE; y <= (path.y + path.h - 1) * BLOCKSIZE; y += BLOCKSIZE) {
                    this.playfield[y][path.x * BLOCKSIZE].dot = 0;
                    this.dotsRemaining--
                }
            }
        }

        for (var k in ENERGIZER) {
            var c = ENERGIZER[k];
            this.playfield[c.y * BLOCKSIZE][c.x * BLOCKSIZE].dot = 2
        }
    }

    adjFun(x, y) {
        if (this.playfield == null)
            return [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let retval = [];
        retval[0] = this.TileCollide(x - 1, y - 1);
        retval[1] = this.TileCollide(x - 0, y - 1);
        retval[2] = this.TileCollide(x + 1, y - 1);

        retval[3] = this.TileCollide(x - 1, y - 0);
        retval[4] = this.TileCollide(x - 0, y - 0);
        retval[5] = this.TileCollide(x + 1, y - 0);

        retval[6] = this.TileCollide(x - 1, y + 1);
        retval[7] = this.TileCollide(x - 0, y + 1);
        retval[8] = this.TileCollide(x + 1, y + 1);
        return retval;
    }

    TileCollide(_x, _y) {
        _x *= 8;
        _y *= 8;
        if (this.playfield[_y] == null || this.playfield[_y][_x] == null)
            return 0b1111;
        // if (_x < 0) _x = this.wide - 1;
        // if (_x >= this.wide) _x = 0;
        // if (_y < 0) _y = this.high - 1;
        // if (_y >= this.high) _y = 0;
        // if (_x < 0 || _x > this.wide || _y < 0 || _y > this.high)
        //     return 0b1111;
        let tile = this.playfield[_y][_x];
        return tile.path ? 0b0000 : 0b1111;
    }


    render(gameRes) {
        if (this.mainRef.gameplayMode == GAMEMODE.LEVEL_COMPLETED) {
            gameRes.renderImage(Math.floor(this.mainRef.frame / 6) % 2 == 0 ? 0 : 1, this.playfieldX, this.playfieldY);
        }
        else {
            gameRes.renderImage(0, this.playfieldX, this.playfieldY);
        }

        let showEnergy = this.mainRef.gameplayMode != GAMEMODE.ORDINARY_PLAYING || Math.floor(this.mainRef.frame / 10) % 2 == 0
        for (let y in this.playfield) {
            let fieldy = this.playfield[y];
            for (let x in fieldy) {
                if (fieldy[x].dot == 1) {
                    gameRes.renderImage(2, Number(x) + this.playfieldX, Number(y) + this.playfieldY)
                } else if (fieldy[x].dot == 2) {
                    if (showEnergy)
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

        this.playfield[14 * 8][-8] = this.playfield[14 * 8][-16] = {
            path: 1,
            dot: 0,
            intersection: 0,
            allowedDir: 12
        };
        this.playfield[14 * 8][28 * 8] = this.playfield[14 * 8][29 * 8] = {
            path: 1,
            dot: 0,
            intersection: 0,
            allowedDir: 12
        };
    };
}