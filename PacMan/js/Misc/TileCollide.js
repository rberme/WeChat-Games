const FIXEDCOEFF = 1024
const BLOCKWIDTH = 8
const fixedBlockWidth = BLOCKWIDTH * FIXEDCOEFF;
const fixedHalfBlockWidth = fixedBlockWidth / 2;
const tempData1 = [0, 0b0110, 0b00000001, 2, 0b0011, 0b01000000, 8, 0b1001, 0b00010000, 6, 0b1100, 0b00000100];
const tempData2 = [0b0010, 0b11000001, 0b1001, 0b10000001, 0b1100, 0b11000000,
    0b0100, 0b00000111, 0b1001, 0b00000011, 0b0011, 0b00000110,
    0b0001, 0b01110000, 0b1100, 0b01100000, 0b0110, 0b00110000,
    0b1000, 0b00011100, 0b0110, 0b00011000, 0b0011, 0b00001100];
const tempData3 = [1, 0b1100, 0b11100000, 3, 0b0011, 0b00001110, 0, 0b1001, 0b10000011, 4, 0b0110, 0b00111000,
    5, 0b1100, 0b11100000, 7, 0b0011, 0b00001110];
const tempData4 = [1, 0b1001, 0b10000011, 5, 0b0110, 0b00111000, 3, 0b1001, 0b10000011, 7, 0b0110, 0b00111000];
const tempData5 = [0, 0b0110, 0b11000001, 1, 0b0011, 0b11000001, 6, 0b1100, 0b00011100, 7, 0b1001, 0b00011100];
const tempData6 = [0, 0b0110, 0b00000111, 2, 0b0011, 0b01110000, 3, 0b1100, 0b00000111, 5, 0b1001, 0b01110000];
const tempData7 = [0b10000000, 0, 1, 0b1100, 2, 0b0010, 0b1001, 0b00000010, 0b0010, 0b1001, 0b00100000,
    0b10000000, 0, 1, 0b1001, 0, 0b0010, 0b1100, 0b00100000, 0b0010, 0b1100, 0b00000010,
    0b00001000, 0, 7, 0b0011, 6, 0b1000, 0b0110, 0b00100000, 0b1000, 0b0110, 0b00000010,
    0b00001000, 0, 7, 0b0110, 8, 0b1000, 0b0011, 0b00000010, 0b1000, 0b0011, 0b00100000,
    0b00100000, 0, 5, 0b0110, 8, 0b0001, 0b1100, 0b10000000, 0b0001, 0b1100, 0b00001000,
    0b00100000, 0, 5, 0b1100, 2, 0b0001, 0b0110, 0b00001000, 0b0001, 0b0110, 0b10000000,
    0b00000010, 0, 3, 0b1001, 0, 0b0100, 0b0011, 0b00001000, 0b0100, 0b0011, 0b10000000,
    0b00000010, 0, 3, 0b0011, 6, 0b0100, 0b1001, 0b10000000, 0b0100, 0b1001, 0b00001000];
const tempData8 = {
    0b01000000: 0b11110001, 0b00100000: 0b11111000,
    0b00010000: 0b01111100, 0b00001000: 0b00111110,
    0b00000100: 0b00011111, 0b00000010: 0b10001111
};
const offsetY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
const offsetX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];

const tempDataForPacman = {
    1: 0b10000000,
    2: 0b00001000,
    4: 0b00000010,
    8: 0b00100000,
};

// import Static from '../Utility/Static'
// let Stat = new Static();
// const __ = {
//   speed: Symbol('speed')
// }

// let databus = new DataBus()

export default class TileCollide {

    constructor() {//width, height, collides) {
        //this.AdjCollides = adjFun;
        this.performanceTimer = [];
        this.performanceTimer[0] = 0;
        this.performanceTimer[1] = 0;
        this.performanceTimer[2] = 0;
    }

    // 1 2 4 8 上 下 左 右
    Move2(player,/*float*/ leftDist, adjFun) {
        this.player = player;
        let dir = this.player.dir;
        let pos = this.player.pos;
        let tempDir = 0b10000000;

        // if (dir == 1) tempDir = 0b10000000;
        // else if (dir == 2) tempDir = 0b00001000;
        // else if (dir == 4) tempDir = 0b00000010;
        // else if (dir == 8) tempDir = 0b00100000;
        // else return pos;
        if (this.player.dir == 0 && this.player.requestDir == 0)
            return pos;

        let fixedPos = [];
        fixedPos[0] = pos[0] * FIXEDCOEFF;
        fixedPos[1] = pos[1] * FIXEDCOEFF;
        let fixedLeftDist = Math.round(FIXEDCOEFF * leftDist);


        while (fixedLeftDist > 0) {
            let mapBlockPosX = Math.floor(fixedPos[0] / fixedBlockWidth);
            let mapBlockPosY = Math.floor(fixedPos[1] / fixedBlockWidth);
            let adjData = adjFun(mapBlockPosX, mapBlockPosY);
            let temp = this.CalcPos(adjData, fixedPos, tempDir, fixedLeftDist);
            fixedPos = temp[0];
            fixedLeftDist = temp[1];
        }

        pos[0] = fixedPos[0] / FIXEDCOEFF;
        pos[1] = fixedPos[1] / FIXEDCOEFF;
        return pos;
    }

    Move(/*Vector2*/ pos, /*Vector2*/ dir, /*float*/ leftDist, adjFun) {

        let tempDir = 0b10000000;

        let absX = Math.abs(dir[0]);
        let absY = Math.abs(dir[1]);
        if (absX < 0.3 && absY < 0.3)
            return pos;
        if (absX < 0.38268343236509) {
            if (dir[1] > 0)
                tempDir = 0b10000000;//上
            else if (dir[1] < 0)
                tempDir = 0b00001000;//下
        }
        else {
            if (absY < 0.38268343236509) {
                if (dir[0] > 0)
                    tempDir = 0b00000010;
                else if (dir[0] < 0)
                    tempDir = 0b00100000;
            }
            else {
                if (dir[0] > 0 && dir[1] < 0) tempDir = 0b00000100;
                else if (dir[0] > 0 && dir[1] > 0) tempDir = 0b00000001;
                else if (dir[0] < 0 && dir[1] > 0) tempDir = 0b01000000;
                else if (dir[0] < 0 && dir[1] < 0) tempDir = 0b00010000;
            }
        }

        let fixedPos = [];
        fixedPos[0] = pos[0] * FIXEDCOEFF;
        fixedPos[1] = pos[1] * FIXEDCOEFF;
        let fixedLeftDist = Math.round(FIXEDCOEFF * leftDist);


        while (fixedLeftDist > 0) {
            let mapBlockPosX = Math.floor(fixedPos[0] / fixedBlockWidth);
            let mapBlockPosY = Math.floor(fixedPos[1] / fixedBlockWidth);
            //let tempTimer = Stat.Performance.now();
            let adjData = adjFun(mapBlockPosX, mapBlockPosY);
            // let tempTimer2 = Stat.Performance.now();
            // this.performanceTimer[0]+=(tempTimer2-tempTimer);

            //tempTimer = Stat.Performance.now();
            let temp = this.CalcPos(adjData, fixedPos, tempDir, fixedLeftDist);
            // tempTimer2 = Stat.Performance.now();
            // this.performanceTimer[1] = (tempTimer2 - tempTimer);
            // this.performanceTimer[2]++;
            fixedPos = temp[0];
            fixedLeftDist = temp[1];
        }
        //console.log("时间比较" + (this.performanceTimer[0] / this.performanceTimer[2]) + ":" + this.performanceTimer[1]);


        pos[0] = fixedPos[0] / FIXEDCOEFF;
        pos[1] = fixedPos[1] / FIXEDCOEFF;
        return pos;
    }

    // MovePos(/*Point*/ fixedPos, /*byte*/ tempDir, /*int*/ fixedLeftDist) {
    //     while (fixedLeftDist > 0) {
    //         //Point tempCurPos = fixedPos;
    //         let mapBlockPosX = Math.floor(fixedPos.X / fixedBlockWidth)
    //         let mapBlockPosY = Math.floor(fixedPos.Y / fixedBlockWidth);

    //         let adjData = this.AdjCollides(mapBlockPosX, mapBlockPosY);//{ 0, 0, 0, 0, 0, 0, 0, 0, 0 };
    //         let temp = this.CalcPos(adjData, fixedPos, tempDir, fixedLeftDist);
    //         fixedPos = temp[0];
    //         fixedLeftDist = temp[1];
    //     }

    //     return fixedPos;
    // }

    // AdjCollides(/*int*/ blockX, /*int*/ blockY) {
    //     //retval: number[] = [];
    //     let retval = [];
    //     for (let i = 0; i < 9; ++i) {
    //         let y = blockY + offsetY[i];
    //         let x = blockX + offsetX[i];
    //         if (x < 0 || x >= this.width || y < 0 || y >= this.height)
    //             retval[i] = 0b1111;//CollideType._1111;
    //         else {
    //             let collide = this.collides[y * this.width + x] & 0b1111;
    //             let state = this.collides[y * this.width + x] >> 4;
    //             retval[i] = collide;
    //         }
    //     }
    //     return retval;
    // }

    CalcPos(/*byte[]*/ adjData, /*Point*/ fixedCurPos, /*byte*/ tempDir, /*ref int*/ fixedLeftDist) {
        //计算可走方向////////////////////////////////////////////////
        let finalDir = 0b00000000;//表示↑↗→↘↓↙←↖八个方向都可以走
        let deltaX = Math.abs(fixedCurPos[0]) % fixedBlockWidth;
        let deltaY = Math.abs(fixedCurPos[1]) % fixedBlockWidth;

        if (deltaX == fixedHalfBlockWidth && deltaY == fixedHalfBlockWidth) {

            for (let i = 0; i < 4; i++) {
                if ((adjData[tempData1[i * 3 + 0]] & tempData1[i * 3 + 1]) > 0)
                    finalDir |= tempData1[i * 3 + 2];

                if ((adjData[2 * i + 1] & tempData2[6 * i + 0]) > 0)
                    finalDir |= tempData2[6 * i + 1];
                else if ((adjData[2 * i + 1] & tempData2[6 * i + 2]) == tempData2[6 * i + 2])
                    finalDir |= tempData2[6 * i + 3];
                else if ((adjData[2 * i + 1] & tempData2[6 * i + 4]) == tempData2[6 * i + 4])
                    finalDir |= tempData2[6 * i + 5];
            }
        }
        else if (deltaX == deltaY) {
            let startIdx = 0;
            let endIdx = 6;
            if (deltaX == 0)
                endIdx = 4;
            else if (deltaX < fixedHalfBlockWidth)
                endIdx = 2;
            else startIdx = 4;
            for (let i = startIdx; i < endIdx; ++i) {
                if ((adjData[tempData3[3 * i + 0]] & tempData3[3 * i + 1]) == tempData3[3 * i + 1])
                    finalDir |= tempData3[3 * i + 2];
            }
        }
        else if (deltaX + deltaY == fixedBlockWidth) {
            let startIdx = 0;
            let endIdx = 4;
            if (deltaX > fixedHalfBlockWidth)
                endIdx = 2;
            else startIdx = 2;
            for (let i = startIdx; i < endIdx; ++i) {
                if ((adjData[tempData4[3 * i + 0]] & tempData4[3 * i + 1]) == tempData4[3 * i + 1])
                    finalDir |= tempData4[3 * i + 2];
            }
        }
        else if (deltaY == fixedHalfBlockWidth) {
            let halfDown = (deltaX > fixedHalfBlockWidth ? 1 : 0);
            for (let i = 0; i < 4; ++i) {
                if ((adjData[tempData5[3 * i] + halfDown] & tempData5[3 * i + 1]) > 0)
                    finalDir |= tempData5[3 * i + 2];
            }
        }
        else if (deltaX == fixedHalfBlockWidth) {
            let halfDown = (deltaY > fixedHalfBlockWidth ? 3 : 0);
            for (let i = 0; i < 4; ++i) {
                if ((adjData[tempData6[3 * i] + halfDown] & tempData6[3 * i + 1]) > 0)
                    finalDir |= tempData6[3 * i + 2];
            }
        }
        finalDir ^= 0b11111111;

        //原版////////////////////////////////////////////////
        // let tempDir_OffsetRange = 0;
        // let tempDir2 = tempDir;
        // let tempDir3 = tempDir;
        // if (tempDir2 == 0b00000001) {
        //     tempDir2 = 0b10000000;
        //     tempDir3 = 0b00000010;
        //     tempDir_OffsetRange = 0b11000111;
        // }
        // else if (tempDir2 == 0b10000000) {
        //     tempDir2 = 0b00000001;
        //     tempDir3 = 0b01000000;
        //     tempDir_OffsetRange = 0b11100011;
        // }
        // else {
        //     tempDir2 = tempDir >> 1;
        //     tempDir3 = tempDir << 1;
        //     tempDir_OffsetRange = tempData8[tempDir];
        // }

        // let checkDir = tempDir;
        // if ((finalDir & tempDir) == 0) {
        //     if ((finalDir & tempDir2) == 0) {
        //         if ((finalDir & tempDir3) == 0) {
        //             if ((tempDir_OffsetRange & finalDir) > 0) {
        //                 checkDir = this.MoveOffset(adjData, tempDir, deltaX, deltaY);
        //                 if (checkDir == 0) {
        //                     fixedLeftDist = 0;
        //                     return [fixedCurPos,0];
        //                 }
        //             }
        //             else {
        //                 fixedLeftDist = 0;
        //                 return [fixedCurPos,0];
        //             }
        //         }
        //         else checkDir = tempDir3;
        //     }
        //     else
        //         checkDir = tempDir2;
        // }
        ///////////////////////////////////////////////////
        //修改以符合吃豆人要求/////////////////////////////////////////////////

        let preferDir = [this.player.requestDir, this.player.dir];
        let checkDir;
        let deltaMove = false;
        for (let i = 0; i < preferDir.length; ++i) {
            if (i == 0 && preferDir[i] == 0)
                continue;
            else if (i == 1 && preferDir[i] == 0) {
                fixedLeftDist = 0;
                return [fixedCurPos, 0];
            }
            let tempDir_OffsetRange = 0;
            let tempDir = tempDataForPacman[preferDir[i]];
            let tempDir2 = tempDir;
            let tempDir3 = tempDir;
            if (tempDir2 == 0b00000001) {
                tempDir2 = 0b10000000;
                tempDir3 = 0b00000010;
                tempDir_OffsetRange = 0b11000111;
            }
            else if (tempDir2 == 0b10000000) {
                tempDir2 = 0b00000001;
                tempDir3 = 0b01000000;
                tempDir_OffsetRange = 0b11100011;
            }
            else {
                tempDir2 = tempDir >> 1;
                tempDir3 = tempDir << 1;
                tempDir_OffsetRange = tempData8[tempDir];
            }


            checkDir = tempDir;
            if ((finalDir & tempDir) == 0) {
                if ((finalDir & tempDir2) == 0) {
                    if ((finalDir & tempDir3) == 0) {
                        if ((tempDir_OffsetRange & finalDir) > 0) {
                            checkDir = this.MoveOffset(adjData, tempDir, deltaX, deltaY);
                            if (checkDir == 0) {
                                if (i == 0) continue;
                                this.player.dir = 0;
                                fixedLeftDist = 0;
                                return [fixedCurPos, 0];
                            }
                            else
                                deltaMove = true;
                        }
                        else {
                            if (i == 0) continue;
                            this.player.dir = 0;
                            fixedLeftDist = 0;
                            return [fixedCurPos, 0];
                        }
                    }
                    else checkDir = tempDir3;
                }
                else
                    checkDir = tempDir2;
            }
            if (i == 0) {
                this.player.dir = this.player.requestDir;
                this.player.requestDir = 0;
                //fixedLeftDist+=3686;
            }
            break;
        }
        ///////////////////////////////////////////////////
        deltaX = (deltaX == 0 && (checkDir & 0b00000111) > 0) ? fixedBlockWidth : deltaX;
        deltaY = (deltaY == 0 && (checkDir & 0b11000001) > 0) ? fixedBlockWidth : deltaY;

        if (deltaMove == false && this.player.deltaDist > 0){
            fixedLeftDist += (this.player.deltaDist>>1);
            this.player.deltaDist = 0;
        }
        let tempDist = this.CalcMaxDist(fixedCurPos, checkDir, deltaX, deltaY, fixedLeftDist);
        if (deltaMove)
            this.player.deltaDist += (fixedLeftDist - tempDist[1]);
        return tempDist;
    }


    CalcMaxDist(/*Point*/ fixedCurPos, /*byte*/ dir, /*int*/ dx, /*int*/ dy, /*ref int*/ fixedLeftDist) {
        let maxDist = 0;
        if ((dir & 0b01010101) > 0) {
            let deltaX = dx;
            let deltaY = dy;
            if ((dir & 0b01000000) > 0)
                deltaX = fixedBlockWidth - deltaX;
            else if ((dir & 0b00010000) > 0) {
                deltaX = fixedBlockWidth - deltaX;
                deltaY = fixedBlockWidth - deltaY;
            }
            else if ((dir & 0b00000100) > 0)
                deltaY = fixedBlockWidth - deltaY;

            if (deltaX <= fixedHalfBlockWidth && deltaY <= fixedHalfBlockWidth)
                maxDist = Math.min(deltaX, deltaY);
            else if (deltaX > fixedHalfBlockWidth && deltaY > fixedHalfBlockWidth)
                maxDist = Math.min(deltaX, deltaY) - fixedHalfBlockWidth;
            else {
                if (deltaX > fixedHalfBlockWidth)
                    deltaX -= fixedHalfBlockWidth;
                else if (deltaY > fixedHalfBlockWidth)
                    deltaY -= fixedHalfBlockWidth;

                if (deltaX + deltaY <= fixedHalfBlockWidth)
                    maxDist = Math.min(deltaX, deltaY);
                else maxDist = Math.max(1, (fixedHalfBlockWidth - deltaX - deltaY) / 2);
            }
            return this.TempFun2(fixedCurPos, maxDist, dir, fixedLeftDist);//, ref fixedLeftDist);
        }
        else {
            let deltaX = dx;
            let deltaY = dy;
            if ((dir & 0b10000000) > 0) {
                deltaX = Math.abs(fixedHalfBlockWidth - dx);
                deltaY = dy;
            }
            else if ((dir & 0b00100000) > 0)//右
            {
                deltaY = fixedBlockWidth - dx;
                deltaX = Math.abs(fixedHalfBlockWidth - dy);
            }
            else if ((dir & 0b00001000) > 0) {
                deltaX = Math.abs(fixedHalfBlockWidth - dx);
                deltaY = fixedBlockWidth - dy;
            }
            else if ((dir & 0b00000010) > 0)//左
            {
                deltaY = dx;
                deltaX = Math.abs(fixedHalfBlockWidth - dy);
            }

            if (deltaX + deltaY <= fixedHalfBlockWidth)
                maxDist = deltaY;
            else if (deltaY <= fixedHalfBlockWidth)
                maxDist = deltaY - fixedHalfBlockWidth + deltaX;
            else if (deltaY - deltaX <= fixedHalfBlockWidth)
                maxDist = deltaY - fixedHalfBlockWidth;
            else maxDist = deltaY - fixedHalfBlockWidth - deltaX;

            return this.TempFun(fixedCurPos, maxDist, dir, fixedLeftDist);//, ref fixedLeftDist);
        }
    }

    TempFun2(/*Point*/ fixedCurPos, /*int*/ temp, /*byte*/ tempDir, /*ref int*/ fixedLeftDist) {
        let maxDist = Math.round(1.41421356 * temp);
        if (fixedLeftDist >= maxDist) {
            fixedLeftDist = fixedLeftDist - maxDist;
        }
        else {
            temp = Math.round(fixedLeftDist / 1.41421356);
            fixedLeftDist = 0;
        }

        if (tempDir == 0b00000001) {
            fixedCurPos[0] -= temp;
            fixedCurPos[1] -= temp;
        }
        else if (tempDir == 0b01000000) {
            fixedCurPos[0] += temp;
            fixedCurPos[1] -= temp;
        }
        else if (tempDir == 0b00010000) {
            fixedCurPos[0] += temp;
            fixedCurPos[1] += temp;
        }
        else if (tempDir == 0b00000100) {
            fixedCurPos[0] -= temp;
            fixedCurPos[1] += temp;
        }
        return [fixedCurPos, fixedLeftDist];
    }
    TempFun(/*Point*/ fixedCurPos, /*int*/ num, /*byte*/ tempDir, /*ref int*/ fixedLeftDist) {
        let maxDist = num;
        if (fixedLeftDist > maxDist) {
            fixedLeftDist = fixedLeftDist - maxDist;
        }
        else {
            maxDist = fixedLeftDist;
            fixedLeftDist = 0;
        }
        if (tempDir == 0b00000010) {
            fixedCurPos[0] -= maxDist;
        }
        else if (tempDir == 0b00100000)
            fixedCurPos[0] += maxDist;
        else if (tempDir == 0b00001000)
            fixedCurPos[1] += maxDist;
        else if (tempDir == 0b10000000) {
            fixedCurPos[1] -= maxDist;
        }
        return [fixedCurPos, fixedLeftDist];
    }


    MoveOffset(/*byte[]*/ adjData, /*byte*/ tempDir, /*int*/ deltaX, /*int*/ deltaY) {
        let checkDir = 0b00000000;

        let tempData = [
            deltaX > fixedHalfBlockWidth ? 1 : 0, deltaX < fixedHalfBlockWidth ? 1 : 0,
            deltaX < fixedHalfBlockWidth ? 1 : 0, deltaX > fixedHalfBlockWidth ? 1 : 0,
            deltaY > fixedHalfBlockWidth ? 1 : 0, deltaY < fixedHalfBlockWidth ? 1 : 0,
            deltaY < fixedHalfBlockWidth ? 1 : 0, deltaY > fixedHalfBlockWidth ? 1 : 0,
        ];

        let tempCol = 11;

        for (let i = 0; i < 8; ++i) {
            if ((tempDir & tempData7[i * tempCol + 0]) > 0) {
                if (tempData[i] == 1) {
                    if (((adjData[tempData7[i * tempCol + 2]] | tempData7[i * tempCol + 3]) == tempData7[i * tempCol + 3] &&
                        (adjData[tempData7[i * tempCol + 4]] & tempData7[i * tempCol + 5]) == tempData7[i * tempCol + 5]) ||
                        (adjData[tempData7[i * tempCol + 2]] == tempData7[i * tempCol + 3]) ||
                        (adjData[tempData7[i * tempCol + 4]] == tempData7[i * tempCol + 6]))
                        checkDir = tempData7[i * tempCol + 7];
                    if ((adjData[tempData7[i * tempCol + 2]] & tempData7[i * tempCol + 8]) == tempData7[i * tempCol + 8] &&
                        (adjData[tempData7[i * tempCol + 4]] | tempData7[i * tempCol + 9]) == tempData7[i * tempCol + 9])
                        checkDir = tempData7[i * tempCol + 10];
                }
            }
        }
        return checkDir;
    }
}
