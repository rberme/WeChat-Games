import Utils from "./Utils"
// import Line from "./Line"

const ITEMTYPE = {
    EMPTY: 0,
    MIRROR: 1, //固定的反射体
    BOX: 2, //障碍物
}

//const Sqrt2 = 1.4142135623730950488016887242097

export default class Item {
    constructor() {
        this.typ = PLANETYPE.EMPTY;
    }

    Init(pos, typ, dir) {
        this.pos = pos;
        this.typ = typ;


        if (this.typ == PLANETYPE.LIGHTER) {
            this.normalDir = dir;
        } else if (this.typ == PLANETYPE.MIRROR) {

        }


    }



    RefreshReflectPlane() {

        this.start[0] = this.center[0] + -this.normalDir[1] * this.radius
        this.start[1] = this.center[1] + this.normalDir[0] * this.radius;

        this.end[0] = this.center[0] + this.normalDir[1] * this.radius
        this.end[1] = this.center[1] + -this.normalDir[0] * this.radius;
    }





    Update(frame) {
        if (this.typ == PLANETYPE.ROTATER) {

        }
    }


    Render(gameRes) {
        if (this.typ == PLANETYPE.LIGHTER) {
            gameRes.DrawLine(this.center, [this.center[0] + this.normalDir[0] * 20, this.center[1] + this.normalDir[1] * 20])

        } else if (this.typ == PLANETYPE.ROTATER) {
            gameRes.DrawLine(this.center, [this.center[0] + this.normalDir[0] * 20, this.center[1] + this.normalDir[1] * 20])
            gameRes.DrawLine(this.start, this.end)

        } else if (this.typ == PLANETYPE.POLYGON) {
            gameRes.DrawPolygon(this.center, this.points, "red", "fill")
        }
    }

    LightEffect(inLine, outLine) {
        switch (this.typ) {
            case PLANETYPE.BLACKHOLE:
                return this.LightWarp(inLine, outLine);
                break;
            case PLANETYPE.ENDER:
                //PASS

                break;
            case PLANETYPE.POLYGON:
                return this.PolygonReflect(inLine, outLine);
                break;
            default:
                return this.LightReflect(inLine, outLine)
                break;
        }
    }

    //射线与线段的焦点
    RaySegment(segStart, segEnd, rayStart, rayDir) {
        let segDir = [segEnd[0] - segStart[0], segEnd[1] - segStart[1]]
        //let p = [rayStart[0] + rayDir[0] * len, rayStart[1] + rayDir[1] * len];
        //(rayStart[0] + rayDir[0] * len - segStart[0]) / (rayStart[1] + rayDir[1] * len - segStart[1]) = (segDir[0]) / (segDir[1])
        //(rayStart[0] + rayDir[0] * len - segStart[0]) * segDir[1] = (rayStart[1] + rayDir[1] * len - segStart[1]) * segDir[0]
        //rayStart[0] * segDir[1] + rayDir[0] * segDir[1] * len - segStart[0] * segDir[1] = rayStart[1] * segDir[0] + rayDir[1] * segDir[0] * len - segStart[1] * segDir[0]
        //(rayDir[0] * segDir[1]  - rayDir[1] * segDir[0]) * len = (rayStart[1] * segDir[0] - segStart[1] * segDir[0] - rayStart[0] * segDir[1] + segStart[0] * segDir[1])

        let len = (rayStart[1] * segDir[0] - segStart[1] * segDir[0] - rayStart[0] * segDir[1] + segStart[0] * segDir[1]) / (rayDir[0] * segDir[1] - rayDir[1] * segDir[0])
        //let temp = [rayStart[0] + rayDir[0] * len, rayStart[1] + rayDir[1] * len];
        let temp0 = rayStart[0] + rayDir[0] * len;
        let temp1 = rayStart[1] + rayDir[1] * len;


        if ((segStart[0] - temp0) * (segEnd[0] - temp0) + (segStart[1] - temp1) * (segEnd[1] - temp1) <= 0 &&
            (temp0 - rayStart[0]) * rayDir[0] + (temp1 - rayStart[1]) * rayDir[1] >= 0) {
            return [temp0, temp1, len];
        }
        return null;
    }

    // PolygonReflect(inLine, outLine) {
    //     let minLine = null;
    //     let segStart = [0, 0];
    //     let segEnd = [0, 0];

    //     let pCount = this.points.length
    //     for (let i = 0; i < pCount; i++) {
    //         segStart[0] = this.points[i][0] + this.center[0];
    //         segStart[1] = this.points[i][1] + this.center[1];
    //         segEnd[0] = this.points[(i + 1) % pCount][0] + this.center[0];
    //         segEnd[1] = this.points[(i + 1) % pCount][1] + this.center[1];


    //         let temp = this.RaySegment(segStart, segEnd, inLine.start, inLine.dir);
    //         if (temp == null)
    //             continue;
    //         if (minLine == null)
    //             minLine = temp;
    //         else if (minLine[2] > temp[2]) {
    //             minLine = temp;
    //         }
    //     }
    //     if (minLine != null) {
    //         inLine.len = minLine[2];
    //         // outLine.start[0] = minLine[0];
    //         // outLine.start[1] = minLine[1];

    //         // // minLine = (this.normalDir[0] * -inLine.dir[0] + this.normalDir[1] * -inLine.dir[1]) * 2;

    //         // // outLine.dir[0] = this.normalDir[0] * minLine - -inLine.dir[0];
    //         // // outLine.dir[1] = this.normalDir[1] * minLine - -inLine.dir[1];
    //         // outLine.len = 1;
    //         // outLine.isAble = true;
    //         return true;
    //     }
    //     return false;
    // }

    LightReflect(inLine, outLine) {

        let temp = this.RaySegment(this.start, this.end, inLine.start, inLine.dir);
        if (temp != null) {
            inLine.len = temp[2];
            outLine.start[0] = temp[0];
            outLine.start[1] = temp[1];

            temp = (this.normalDir[0] * -inLine.dir[0] + this.normalDir[1] * -inLine.dir[1]) * 2;

            outLine.dir[0] = this.normalDir[0] * temp - -inLine.dir[0];
            outLine.dir[1] = this.normalDir[1] * temp - -inLine.dir[1];
            outLine.len = 1000;
            outLine.isAble = true;
            return true;
        }
        return false;
    }

}