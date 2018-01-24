
import GameObject from '../Misc/GameObject'

import Static from "../Utility/Static"
import { Global } from '../Utility/Static'

// var ghosts = [  // COLOR    CHARACTER   NICKNAME
//     blinky,     // RED      SHADOW      BLINKY
//     pinky,      // PINK     SPEEDY      PINKY
//     inky,       // BLUE     BASHFUL     INKY
//     clyde       // ORANGE   POKEY       CLYDE
// ];

let GhostMode = {
    Wait: 0,
    Chase: 1,        //追击(默认)
    Scatter: 2,      //散开 移动到固定目标点
    Frigthened: 3    //受惊 随机移动，移动变慢，变成暗蓝色 (随着难度的增加受惊时间越短)
}

var COLUMNS = 19;
var ROWS = 22;
let animRate = [1, 0.95, 0.9, 0.95, 1, 1.05, 1.1, 1.05];
let Stat = new Static();
let altasData = [
    64,//上
    0,//左
    128,//下
    192,//右
]
export default class Ghost extends GameObject {
    constructor(position) {
        super(position);
        //this.nickname = "blinky";
        //this.targetDir = 1;
        // this.image = wx.createImage();
        // this.image.src = "images/blinky.png";
        this.width = 64;
        this.height = 64;
        this.state = GhostMode.Wait;
        this.timer = 420;
        this.animFrame = 0;
    }


    update(pacman, map, mapWidth, mapHeight) {

        if (this.state == GhostMode.Wait)
            return;

        if (Stat.frame % 3 == 0) {
            this.animFrame = (this.animFrame + 1) % animRate.length;
        }
        switch (this.state) {
            case GhostMode.Chase:
                this.timer--;
                if (this.timer <= 0) {
                    this.timer = 420;
                    this.state = GhostMode.Scatter;
                }
                break;
            case GhostMode.Scatter:
                this.timer--;
                if (this.timer <= 0) {
                    this.timer = 1000;
                    this.state = GhostMode.Chase;
                }
                break;
        }
        let moveDistance = 1.35;
        while (moveDistance > 0) {
            let blockXX = this.position.x % Global.TileWidth;
            let blockYY = this.position.y % Global.TileHeight;

            if (blockXX % 16 > 0) {//横向
                if (blockXX < Global.TileWidth / 2) {//在左半边
                    if (this.targetDir == 1) {//往左移动
                        let maxDist = blockXX + Global.TileWidth / 2;
                        if (moveDistance >= maxDist) {
                            this.position.x -= maxDist;
                            if (this.position.x < 0) this.position.x += mapWidth;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.x -= moveDistance;
                            if (this.position.x < 0) this.position.x += mapWidth;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.targetDir == 3) {//往右移动
                        let maxDist = Global.TileWidth / 2 - blockXX;
                        if (moveDistance >= maxDist) {
                            this.position.x += maxDist;
                            if (this.position.x > mapWidth) this.position.x %= mapWidth;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.x += moveDistance;
                            if (this.position.x > mapWidth) this.position.x %= mapWidth;
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
                else {//在格子右半边
                    if (this.targetDir == 1) {//往左移动
                        let maxDist = blockXX - Global.TileWidth / 2;
                        if (moveDistance >= maxDist) {
                            this.position.x -= maxDist;
                            if (this.position.x < 0) this.position.x += mapWidth;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.x -= moveDistance;
                            if (this.position.x < 0) this.position.x += mapWidth;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.targetDir == 3) {//往右移动
                        let maxDist = Global.TileWidth - blockXX + Global.TileWidth / 2;
                        if (moveDistance >= maxDist) {
                            this.position.x += maxDist;
                            if (this.position.x > mapWidth) this.position.x %= mapWidth;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.x += moveDistance;
                            if (this.position.x > mapWidth) this.position.x %= mapWidth;
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
            }
            else if (blockYY % 16 > 0) {//竖向
                if (blockYY < Global.TileWidth / 2) {//在上半边
                    if (this.targetDir == 0) {//往上移动
                        let maxDist = blockYY + Global.TileHeight / 2;
                        if (moveDistance >= maxDist) {
                            this.position.y -= maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.y -= moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.targetDir == 2) {//往下移动
                        let maxDist = Global.TileHeight / 2 - blockYY;
                        if (moveDistance >= maxDist) {
                            this.position.y += maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.y += moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
                else {//在格子下半边
                    if (this.targetDir == 0) {//往上移动
                        let maxDist = blockYY - Global.TileHeight / 2;
                        if (moveDistance >= maxDist) {
                            this.position.y -= maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.y -= moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                    else if (this.targetDir == 2) {//往下移动
                        let maxDist = Global.TileHeight - blockYY + Global.TileHeight / 2;
                        if (moveDistance >= maxDist) {
                            this.position.y += maxDist;
                            moveDistance -= maxDist;
                        }
                        else {
                            this.position.y += moveDistance;
                            moveDistance = 0;
                            continue;
                        }
                    }
                }
            }
            else {//在中心
                if (this.targetDir == 0) {//往上移动
                    let maxDist = Global.TileHeight;
                    if (moveDistance >= maxDist) {
                        this.position.y -= maxDist;
                        moveDistance -= maxDist;
                    }
                    else {
                        this.position.y -= moveDistance;
                        moveDistance = 0;
                        continue;
                    }
                }
                else if (this.targetDir == 2) {//往下移动
                    let maxDist = Global.TileHeight;
                    if (moveDistance >= maxDist) {
                        this.position.y += maxDist;
                        moveDistance -= maxDist;
                    }
                    else {
                        this.position.y += moveDistance;
                        moveDistance = 0;
                        continue;
                    }
                }
                else if (this.targetDir == 1) {//往左移动
                    let maxDist = Global.TileWidth;
                    if (moveDistance >= maxDist) {
                        this.position.x -= maxDist;
                        if (this.position.x < 0) this.position.x += mapWidth;
                        moveDistance -= maxDist;
                    }
                    else {
                        this.position.x -= moveDistance;
                        if (this.position.x < 0) this.position.x += mapWidth;
                        moveDistance = 0;
                        continue;
                    }
                }
                else if (this.targetDir == 3) {//往右移动        
                    let maxDist = Global.TileWidth;
                    if (moveDistance >= maxDist) {
                        this.position.x += maxDist;
                        if (this.position.x > mapWidth) this.position.x %= mapWidth;
                        moveDistance -= maxDist;
                    }
                    else {
                        this.position.x += moveDistance;
                        if (this.position.x > mapWidth) this.position.x %= mapWidth;
                        moveDistance = 0;
                        continue;
                    }
                }
            }


            //break;
            this.updateDir(pacman, map);
        }
    }

    updateDir(pacman, map) {
        let blockX = Math.floor(this.position.x / Global.TileWidth);
        let blockY = Math.floor(this.position.y / Global.TileWidth);

        if (blockY == 10) {
            if (blockX == 8) {
                this.targetDir = 3;
                return;
            } else if (blockX == 9) {
                this.targetDir = 0;
                return;
            } else if (blockX == 10) {
                this.targetDir = 1;
                return;
            }
        }

        var adj_spaces = [
            { y: blockY - 1, x: blockX }, //上
            { y: blockY, x: blockX - 1 }, //左
            { y: blockY + 1, x: blockX }, //下
            { y: blockY, x: blockX + 1 }  //右
        ];

        var behind = this.targetDir - 2;
        if (this.targetDir == 0 || this.targetDir == 1) {
            behind = this.targetDir + 2;
        }

        let movableTiles = [];
        let movableCount = 0;
        for (var i = 0; i < adj_spaces.length; i++) {
            if (i == behind) {
                movableTiles.push(null);
                continue;
            }

            var space = adj_spaces[i];
            if (map(adj_spaces[i].x, adj_spaces[i].y) <= 0) {
                movableTiles.push(space);
                movableCount++;
            }
            else movableTiles.push(null);
        }
        if (movableCount > 1) {
            this.updateTarget(pacman);
        } else if (movableCount == 0) {
            console.error(this.nickname + "怎么会没路了？");
            return;
        }


        let minDistance = Number.MAX_VALUE;
        for (let i = 0; i < movableTiles.length; ++i) {
            if (movableTiles[i] == null)
                continue;
            if (movableCount == 1) {
                this.targetDir = i;
                break;
            }
            let deltaX = Math.abs(this.targetX - movableTiles[i].x);
            let deltaY = Math.abs(this.targetY - movableTiles[i].y);
            let dist = deltaX * deltaX + deltaY * deltaY;
            if (minDistance > dist) {
                minDistance = dist;
                this.targetDir = i;
            }
        }
    }




    render(ctx) {

        let renderWidth = this.width * animRate[this.animFrame];
        let renderHeight = this.height / animRate[this.animFrame];

        let drawX = (this.position.x - renderWidth / 2) / Stat.AdaptRate;
        let drawY = (this.position.y - renderHeight / 2) / Stat.AdaptRate + Stat.inventoryHeight
        let drawWidth = renderWidth / Stat.AdaptRate;
        let drawHeight = renderHeight / Stat.AdaptRate

        ctx.drawImage(
            Stat.gameResource[2],
            altasData[this.targetDir],
            this.type * this.height,
            this.width,
            this.height,
            drawX,
            drawY,
            drawWidth,
            drawHeight);

        if (this.position.x < drawWidth / 2) {
            ctx.drawImage(
                Stat.gameResource[2],
                altasData[this.targetDir],
                this.type * this.height,
                this.width,
                this.height,
                drawX + Stat.screenWidth,
                drawY,
                drawWidth,
                drawHeight
            )
        } else if (Stat.screenWidth - this.position.x < drawWidth / 2) {
            ctx.drawImage(
                Stat.gameResource[2],
                altasData[this.targetDir],
                this.type * this.height,
                this.width,
                this.height,
                drawX - Stat.screenWidth,
                drawY,
                drawWidth,
                drawHeight
            )
        }
    }
}