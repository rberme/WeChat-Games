
import Planet from "./Planet"
import Line from "./Line"

import Utils from "./Utils"


export default class World {
    constructor() {

    }

    Init() {

        this.planets = [];
        this.lighter = new Planet();
        this.lighter.Init([100, 160], 50, 5)
        this.planets.push(this.lighter);

        this.rotater = new Planet();
        this.rotater.Init([300, 400], 50, 2)
        this.planets.push(this.rotater);

        this.rotater2 = new Planet();
        this.rotater2.Init([100, 500], 50, 2)
        this.planets.push(this.rotater2);


        this.blackhole = new Planet();
        this.blackhole.Init([300, 190], 50, 4)
        this.planets.push(this.blackhole);

        this.lines = [];
        for (let i = 0; i < 30; ++i) {
            this.lines.push(new Line())
        }

        this.lines[0].start = this.lighter.center;
        this.lines[0].dir = this.lighter.normalDir;
        this.lines[0].isAble = true;

        this.currTouchPlanet = -1;
        this.lastOutLinePlanet = -1;

    }

    TouchStart(x, y) {
        // this.theLine.dir[0] = x - this.theLine.start[0]
        // this.theLine.dir[1] = y - this.theLine.start[1]
        // Utils.Normalize(this.theLine.dir);

        for (let i in this.planets) {
            if (this.planets[i].InBound(x, y)) {
                this.planets[i].TouchStart(x, y);

                // if (this.planets[i].typ != 5 && this.planets[i].inLine != null) {
                //     this.planets[i].LightReflect(this.planets[i].inLine)
                // }
                this.currTouchPlanet = i;
                break;
            }
        }

        this.TouchMove(x, y, this.currTouchPlanet);

    }

    TouchMove(x, y) {
        if (this.currTouchPlanet >= 0) {
            this.planets[this.currTouchPlanet].TouchMove(x, y);

            // if (this.planets[lightPlanetIdx].outLine != null) {
            //     for (let i in this.planets) {
            //         if (this.planets[i] == this.lighter) {
            //             continue;
            //         }
            //         if (i == lightPlanetIdx) {
            //             if (this.planets[i].inLine != null) {
            //                 this.planets[i].LightReflect(this.planets[i].inLine, false)
            //             }
            //             continue;
            //         }

            //         if (this.planets[i].LightReflect(this.planets[lightPlanetIdx].outLine, true)) {
            //         }
            //     }
            // }

        }

    }

    TouchEnd(x, y) {
        this.currTouchPlanet = -1;
    }


    Update(frame) {
        for (let planet of this.planets) {
            planet.Update(frame);
        }

        this.UpdateLines(0, 0);
    }

    UpdateLines(i, exclude) {
        //for (let planet of this.planets) {
        //发光体不判断
        if (i >= this.lines.length)
            return;
        for (let j = 1; j < this.planets.length; j++) {
            if (j == exclude)
                continue;

            if (this.lines[i].dir[0] > 0) {
                if (this.planets[j].center[0] + this.planets[j].radius < this.lines[i].start[0] - 0.01)
                    continue;
            } else {/* inLine.dir[0]<=0 */
                if (this.planets[j].center[0] - this.planets[j].radius > this.lines[i].start[0] + 0.01)
                    continue;
            }
            if (this.lines[i].dir[1] > 0) {
                if (this.planets[j].center[1] + this.planets[j].radius < this.lines[i].start[1] - 0.01)
                    continue;
            } else {
                if (this.planets[j].center[1] - this.planets[j].radius > this.lines[i].start[1] + 0.01)
                    continue;
            }


            if (this.planets[j].LightEffect(this.lines[i], this.lines[i + 1])) {
                this.UpdateLines(i + 1, j);
                return;
            }
        }
        //光线没有被阻挡
        if (this.lines[i].len > 0) {
            this.lines[i].len = 1000;
        } else {
            this.lines[i].len = 0;
        }

        if (i + 1 < this.lines.length) {
            this.lines[i + 1].isAble = false;
        }
    }


    Render(gameRes) {
        for (let planet of this.planets) {
            planet.Render(gameRes);
        }

        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].isAble == false)
                break;
            this.lines[i].Render(gameRes);
        }
    }


    // IsTouthBall(lightSrc, lightDir, center, radius) {
    //     Utils.Normalize(lightDir);
    //     let light2center = [center[0] - lightSrc[0], center[1] - lightSrc[1]]
    //     let lenLC = Utils.Normalize(light2center);

    //     let sideLen = lightDir[0] * light2center[0] + lightDir[1] * light2center[1];
    //     let sideLen2 = sideLen * sideLen;
    //     let tanθ2 = (1 - sideLen2) / sideLen2;

    //     let lenLC2 = lenLC * lenLC;
    //     let b2_4ac = 4 * lenLC2 - 4 * (1 + tanθ2) * (lenLC2 - radius * radius);
    //     let result2 = 2000;
    //     if (b2_4ac > 0) {
    //         let sqrt_b2_4ac = Utils.Q_Sqrt(b2_4ac)//Math.sqrt(b2_4ac)//
    //         result2 = (2 * lenLC - sqrt_b2_4ac) / (2 * (1 + tanθ2))
    //         result2 = Utils.Q_Sqrt(result2 * result2 * (1 + tanθ2));
    //     }
    //     return result2;
    // }
}