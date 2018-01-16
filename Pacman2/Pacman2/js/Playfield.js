
import { allPaths, noDotPaths} from './GameRes'

export default class Playfield {
    constructor(mainRef) {
        this.determinePlayfieldDimensions()
        this.x = 0;
        this.y = 48;
        this.mainRef = mainRef;
    }



    render(gameRes) {
        gameRes.renderImage(0, this.x,this.y);

        for (let y in this.mainRef.playfield){
            let fieldy = this.mainRef.playfield[y];
            for(let x in fieldy){
                if(fieldy[x].dot>0){
                    gameRes.renderImage(2,Number(x)+this.x,Number(y)+this.y)
                }
            }
        }
    }

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


    reset(){
        this.preparePlayfield();
        this.preparePaths();
    }

    //初始化地图
    preparePlayfield = function () {
        this.mainRef.playfield = [];
        for (var h = 0; h <= this.playfieldHeight; h++) {
            this.mainRef.playfield[h * 8] = [];
            for (var w = 0; w <= this.playfieldWidth ; w++) {
                this.mainRef.playfield[h * 8][w * 8] = {
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
                    this.mainRef.playfield[y][x].path = true;
                    if (this.mainRef.playfield[y][x].dot == 0) {
                        this.mainRef.playfield[y][x].dot = 1;
                        this.dotsRemaining++
                    }
                    this.mainRef.playfield[y][x].type = (!d || x != path.x * 8 && x != (path.x + path.w - 1) * 8 ? d : 0)
                }
                //头尾是交叉路口
                this.mainRef.playfield[y][path.x * 8].intersection = true;
                this.mainRef.playfield[y][(path.x + path.w - 1) * 8].intersection = true
            }
            else {
                let x = path.x * 8;
                for (let y = path.y * 8; y <= (path.y + path.h - 1) * 8; y += 8) {
                    if (this.mainRef.playfield[y][x].path)
                        this.mainRef.playfield[y][x].intersection = true;
                    this.mainRef.playfield[y][x].path = true;
                    if (this.mainRef.playfield[y][x].dot == 0) {
                        this.mainRef.playfield[y][x].dot = 1;
                        this.dotsRemaining++
                    }
                    this.mainRef.playfield[y][x].type = (!d || y != path.y * 8 && y != (path.y + path.h - 1) * 8 ? d : 0)
                }
                this.mainRef.playfield[path.y * 8][x].intersection = true;
                this.mainRef.playfield[(path.y + path.h - 1) * 8][x].intersection = true
            }
        }
        //去除掉没有点的路径上的点
        for (idx in noDotPaths) {
            var path = noDotPaths[idx]
            if (path.w) {
                for (let x = path.x * 8; x <= (path.x + path.w - 1) * 8; x += 8) {
                    this.mainRef.playfield[path.y * 8][x].dot = 0;
                    this.dotsRemaining--
                }
            }
            else {
                for (let y = path.y * 8; y <= (path.y + path.h - 1) * 8; y += 8) {
                    this.mainRef.playfield[y][path.x * 8].dot = 0;
                    this.dotsRemaining--
                }
            }
        }
    }
}