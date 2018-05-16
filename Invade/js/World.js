import Planet from "./Planet"
import Spaceship from "./Spaceship"
import Random from "./Random"
import Utils from "./Utils"




let rand = new Random();

export default class World {
    constructor() {
        this.CreatePlanets();
        this.CreateShips();
        this.startIdx = this.endIdx = -1;
        this.fingerPos = [0, 0];
        this.waitShips = [];
        this.flyShips = [];
    }

    CreatePlanets() {
        this.planets = [];
        this.planets.push(new Planet([80 * Utils.MULTI, 111 * Utils.MULTI], 50 * Utils.MULTI, 0))
        this.planets.push(new Planet([80 * Utils.MULTI, 333 * Utils.MULTI], 60 * Utils.MULTI, 1))
        this.planets.push(new Planet([80 * Utils.MULTI, 600 * Utils.MULTI], 40 * Utils.MULTI, 2))
        this.planets.push(new Planet([188 * Utils.MULTI, 180 * Utils.MULTI], 50 * Utils.MULTI, 3))
        this.planets.push(new Planet([188 * Utils.MULTI, 500 * Utils.MULTI], 80 * Utils.MULTI, 4))
        this.planets.push(new Planet([300 * Utils.MULTI, 120 * Utils.MULTI], 60 * Utils.MULTI, 5))
        this.planets.push(new Planet([280 * Utils.MULTI, 333 * Utils.MULTI], 70 * Utils.MULTI, 6))
        this.planets.push(new Planet([320 * Utils.MULTI, 600 * Utils.MULTI], 50 * Utils.MULTI, 7))
        // this.planets[8] = new Planet([333 * Utils.MULTI, 188 * Utils.MULTI], 80 * Utils.MULTI)
    }

    CreateShips() {
        this.ships = [];
        for (let i = 0; i < 100; i++) {
            let ship = new Spaceship([rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 100 * Utils.MULTI, rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 188 * Utils.MULTI]);
            this.ships.push(ship);
            ship.target = [rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 600 * Utils.MULTI, rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 188 * Utils.MULTI];
        }
    }

    Update(frame) {
        for (let i = 0; i < frame; ++i) {
            if (this.waitShips.length > 0) {
                this.flyShips.push(this.waitShips.shift());
            } else
                break;
        }

        for (let i = this.flyShips.length - 1; i >= 0; i--) {
            let ship = this.flyShips[i];
            ship.ResetDir();
            for (let j in this.planets) {
                if (ship.startIdx != j && ship.endIdx != j) {
                    ship.Dir = this.planets[j].FilterDir(ship.pos, ship.Dir);
                }
            }

            if (ship.Update(frame) == false) {
                this.ships.push(ship);
                this.flyShips.splice(i, 1);
            }
        }
    }

    Draw(gameRes) {
        //gameRes.RenderText("world", 100, 100, 100);
        for (let i in this.planets) {
            this.planets[i].Draw(gameRes);
        }

        for (let i = this.flyShips.length - 1; i >= 0; i--) {
            let ship = this.flyShips[i];
            // if (ship.Draw(gameRes) == false) {
            //     this.ships.push(ship);
            //     this.flyShips.splice(i, 1);
            //     continue;
            // }
            ship.Draw(gameRes);
        }

        // for (let i in this.flyShips) {
        //     
        // }

        if (this.startIdx >= 0) {
            gameRes.DrawLine(this.planets[this.startIdx].center, this.endIdx >= 0 ? this.planets[this.endIdx].center : this.fingerPos);
        }
    }
    // Move() {
    //     for (i = 0; i < arguments.length; i++) {

    //     }
    // }


    MoveStart(x, y) {
        for (let i in this.planets) {
            let planet = this.planets[i];
            let dx = (x * Utils.MULTI) - planet.center[0];
            let dy = (y * Utils.MULTI) - planet.center[1];
            if ((dx * dx + dy * dy) < planet.radius * planet.radius) {
                this.fingerPos[0] = planet.center;

                this.startIdx = i;
                return;
            }
        }

    }

    Moving(x, y) {
        if (this.startIdx < 0)
            return;
        this.fingerPos[0] = x * Utils.MULTI;
        this.fingerPos[1] = y * Utils.MULTI;
        this.endIdx = -1;
        for (let i in this.planets) {
            if (i == this.startIdx)
                continue;
            let planet = this.planets[i];
            let dx = (x * Utils.MULTI) - planet.center[0];
            let dy = (y * Utils.MULTI) - planet.center[1];
            if ((dx * dx + dy * dy) < planet.radius * planet.radius) {
                this.endIdx = i;
                return;
            }
        }
    }


    MoveOne() {
        if (this.endIdx < 0) {
            this.startIdx = -1;
            return;
        }
        let count = 30;
        for (let i = 0; i < count; ++i) {
            let ship = this.ships.pop();
            if (ship == null)
                break;
            let planet = this.planets[this.startIdx];
            ship.pos[0] = planet.center[0] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
            ship.pos[1] = planet.center[1] + rand.Range(-planet.radius >> 1, planet.radius >> 1);

            planet = this.planets[this.endIdx];
            ship.target[0] = planet.center[0] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
            ship.target[1] = planet.center[1] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
            ship.startIdx = this.startIdx;
            ship.endIdx = this.endIdx;

            ship.active = true;

            this.waitShips.push(ship);


        }
        this.startIdx = this.endIdx = -1;
    }


}