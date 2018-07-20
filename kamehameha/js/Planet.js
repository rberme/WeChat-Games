import Utils from "./Utils"
// import Line from "./Line"

const PLANETYPE = {
    EMPTY: 0,
    FIXED: 1,//固定的反射体
    ROTATER: 2,//可旋转的反射体
    MOVABLE: 3,//可移动的反射体
    BLACKHOLE: 4,//黑洞
    LIGHTER: 5,//光源
    STONE: 6,//障碍物
    ENDER: 7,//终点
    POLYGON: 8,//多边形
}

//const Sqrt2 = 1.4142135623730950488016887242097

export default class Planet {
    constructor() {
        //this.normalDir = [0, 0];
        this.typ = PLANETYPE.EMPTY;
        //this.inLine = null;
        //this.outLine = new Line();
        this.start = [0, 0];
        this.end = [0, 0]
    }

    Init(center, radius, typ) {
        this.radius = radius;
        this.center = center;
        this.typ = typ;
        // switch (typ) {
        //     case PLANETYPE.LIGHTER:
        //         this.dir = [0, 0];
        //         break;
        // }


        if (this.typ == PLANETYPE.LIGHTER) {
            this.normalDir = [100, -200];
            Utils.Normalize(this.normalDir);
        } else if (this.typ == PLANETYPE.ROTATER) {
            this.normalDir = [100, -200];
            Utils.Normalize(this.normalDir);
            this.RefreshReflectPlane();
        } else if (this.typ == PLANETYPE.POLYGON) {
            this.points = [[-80, -40], [0, -60], [10, 50], [-30, 60], [-10, 20]]
        }

    }

    InBound(x, y) {
        let deltaX = x - this.center[0];
        let deltaY = y - this.center[1];
        let len2 = deltaX * deltaX + deltaY * deltaY;
        return len2 < this.radius * this.radius;
    }


    TouchStart(x, y) {
        this.TouchMove(x, y)
    }

    TouchMove(x, y) {
        if (this.typ == PLANETYPE.LIGHTER) {
            this.normalDir[0] = x - this.center[0]
            this.normalDir[1] = y - this.center[1]
            Utils.Normalize(this.normalDir);
        } else if (this.typ == PLANETYPE.ROTATER) {
            this.normalDir[0] = x - this.center[0]
            this.normalDir[1] = y - this.center[1]
            Utils.Normalize(this.normalDir);
            this.RefreshReflectPlane();


        }
    }


    RefreshReflectPlane() {

        this.start[0] = this.center[0] + -this.normalDir[1] * this.radius
        this.start[1] = this.center[1] + this.normalDir[0] * this.radius;

        this.end[0] = this.center[0] + this.normalDir[1] * this.radius
        this.end[1] = this.center[1] + -this.normalDir[0] * this.radius;
    }


    TouchEnd() {

    }



    Update(frame) {
        if (this.typ == PLANETYPE.ROTATER) {

        }
    }


    Render(gameRes) {
        //gameRes.DrawCircle(this.center, this.radius, this.color);
        if (this.typ == PLANETYPE.LIGHTER) {
            gameRes.DrawLine(this.center, [this.center[0] + this.normalDir[0] * 20, this.center[1] + this.normalDir[1] * 20])
        } else if (this.typ == PLANETYPE.ROTATER) {
            //DrawLine(start, end, color = "gray") {
            gameRes.DrawLine(this.center, [this.center[0] + this.normalDir[0] * 20, this.center[1] + this.normalDir[1] * 20])
            gameRes.DrawLine(this.start, this.end)

            //if (this.outLineAble == true) {
            //gameRes.DrawLine(this.outLine.start, [this.outLine.start[0] + this.normalDir[0] * 20, this.outLine.start[1] + this.normalDir[1] * 20])
            //this.outLine.Render(gameRes);
            //}

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

    PolygonReflect(inLine, outLine) {
        let minLine = null;
        let segStart = [0, 0];
        let segEnd = [0, 0];

        let pCount = this.points.length
        for (let i = 0; i < pCount; i++) {
            segStart[0] = this.points[i][0] + this.center[0];
            segStart[1] = this.points[i][1] + this.center[1];
            segEnd[0] = this.points[(i + 1) % pCount][0] + this.center[0];
            segEnd[1] = this.points[(i + 1) % pCount][1] + this.center[1];


            let temp = this.RaySegment(segStart, segEnd, inLine.start, inLine.dir);
            if (temp == null)
                continue;
            if (minLine == null)
                minLine = temp;
            else if (minLine[2] > temp[2]) {
                minLine = temp;
            }
        }
        if (minLine != null) {
            inLine.len = minLine[2];
            // outLine.start[0] = minLine[0];
            // outLine.start[1] = minLine[1];

            // // minLine = (this.normalDir[0] * -inLine.dir[0] + this.normalDir[1] * -inLine.dir[1]) * 2;

            // // outLine.dir[0] = this.normalDir[0] * minLine - -inLine.dir[0];
            // // outLine.dir[1] = this.normalDir[1] * minLine - -inLine.dir[1];
            // outLine.len = 1;
            // outLine.isAble = true;
            return true;
        }
        return false;
    }

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


    LightWarp(inLine, outLine) {
        //Utils.Normalize(lightDir);
        let light2center = [this.center[0] - inLine.start[0], this.center[1] - inLine.start[1]]

        let lenLC = Utils.Normalize(light2center);

        let sideLen = inLine.dir[0] * light2center[0] + inLine.dir[1] * light2center[1];
        let sideLen2 = sideLen * sideLen;
        let tanθ2 = (1 - sideLen2) / sideLen2;

        let lenLC2 = lenLC * lenLC;
        let b2_4ac = 4 * lenLC2 - 4 * (1 + tanθ2) * (lenLC2 - this.radius * this.radius);
        //let result2 = 1000;
        if (b2_4ac >= 0) {
            let sqrt_b2_4ac = Utils.Q_Sqrt(b2_4ac)//Math.sqrt(b2_4ac)//
            let result2 = (2 * lenLC - sqrt_b2_4ac) / (2 * (1 + tanθ2))
            inLine.len = Utils.Q_Sqrt(result2 * result2 * (1 + tanθ2));


            result2 = (2 * lenLC + sqrt_b2_4ac) / (2 * (1 + tanθ2))
            result2 = Utils.Q_Sqrt(result2 * result2 * (1 + tanθ2));

            // outLine.start[0] = inLine.start[0] + inLine.dir[0] * result2;
            // outLine.start[1] = inLine.start[1] + inLine.dir[1] * result2;
            // outLine.dir = inLine.dir;
            // outLine.isAble = true;


            let outStart = [];
            outStart[0] = inLine.start[0] + inLine.dir[0] * result2;
            outStart[1] = inLine.start[1] + inLine.dir[1] * result2;

            let center2outStart = [outStart[0] - this.center[0], outStart[1] - this.center[1]];
            Utils.Normalize(center2outStart);

            let cos90_θ = (center2outStart[0] * inLine.dir[0] + center2outStart[1] * inLine.dir[1])
            //cos90_θ/1.5*this.radius

            // //圆内线段的一半长度
            // let halfInCircle = temp * this.radius

            // //出口点到垂足的向量
            // let vec1 = [halfInCircle * -inLine.dir[0], halfInCircle * -inLine.dir[1]];

            // //垂足的位置
            // let pedal = [];
            // pedal[0] = outStart[0] + vec1[0];
            // pedal[1] = outStart[1] + vec1[1];

            // if ((pedal[0] - this.center[0]) * (pedal[0] - this.center[0]) + (pedal[1] - this.center[1]) * (pedal[1] - this.center[1]) < this.radius * this.radius*4 / 9) {
            //     outLine.isAble = true;
            //     outLine.len = -1;
            //     return true;
            // }

            // //出口点到圆心一部分的向量
            // let vec2 = [temp * halfInCircle * -center2outStart[0], temp * halfInCircle * -center2outStart[1]];

            // let final = [vec2[0] - vec1[0], vec2[1] - vec1[1]];

            // outLine.dir[0] = final[0];
            // outLine.dir[1] = final[1];
            // Utils.Normalize(outLine.dir);

            // final[0] = (vec2[0] - vec1[0]) * 2 + pedal[0] - this.center[0];
            // final[1] = (vec2[1] - vec1[1]) * 2 + pedal[1] - this.center[1];

            // Utils.Normalize(final);

            // outLine.start[0] = this.center[0] + final[0] * this.radius;
            // outLine.start[1] = this.center[1] + final[1] * this.radius;
            // outLine.isAble = true;
            // outLine.len = 1000;






            return true;
        }
        outLine.len = 1;
        return false;
    }
}