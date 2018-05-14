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
    }

    CreatePlanets() {
        this.planets = [];
        this.planets[0] = new Planet([111 * Utils.MULTI, 80 * Utils.MULTI], 50 * Utils.MULTI, 0)
        this.planets[1] = new Planet([333 * Utils.MULTI, 80 * Utils.MULTI], 60 * Utils.MULTI, 1)
        this.planets[2] = new Planet([600 * Utils.MULTI, 80 * Utils.MULTI], 40 * Utils.MULTI, 2)
        this.planets[3] = new Planet([180 * Utils.MULTI, 188 * Utils.MULTI], 50 * Utils.MULTI, 3)
        this.planets[4] = new Planet([500 * Utils.MULTI, 188 * Utils.MULTI], 80 * Utils.MULTI, 4)
        this.planets[5] = new Planet([120 * Utils.MULTI, 300 * Utils.MULTI], 60 * Utils.MULTI, 5)
        this.planets[6] = new Planet([333 * Utils.MULTI, 280 * Utils.MULTI], 70 * Utils.MULTI, 6)
        this.planets[7] = new Planet([600 * Utils.MULTI, 320 * Utils.MULTI], 50 * Utils.MULTI, 7)
        // this.planets[8] = new Planet([333 * Utils.MULTI, 188 * Utils.MULTI], 80 * Utils.MULTI)
    }

    CreateShips() {
        this.ships = [];
        for (let i = 0; i < 30; i++) {
            let ship = new Spaceship([rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 100 * Utils.MULTI, rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 188 * Utils.MULTI]);
            this.ships.push(ship);
            ship.target = [rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 600 * Utils.MULTI, rand.Range(-50 * Utils.MULTI, 50 * Utils.MULTI) + 188 * Utils.MULTI];
        }
    }

    Update(frame) {
        for (let i in this.ships) {
            let ship = this.ships[i];
            if (ship.active == false)
                continue;
            ship.Dir = [ship.target[0] - ship.pos[0], ship.target[1] - ship.pos[1]];
            ship.Dir = this.planets[0].FilterDir(ship.pos, ship.Dir);
            this.ships[i].Update(frame);
        }
    }

    // Move() {
    //     for (i = 0; i < arguments.length; i++) {

    //     }
    // }


    MoveStart(x, y) {
        for (let i in this.planets) {
            let planet = this.planets[i];
        }

    }

    Moving(x, y) {
        if (this.startIdx < 0)
            return;
    }


    MoveOne() {
        if (this.endIdx < 0) {
            this.startIdx = -1;
            return;
        }
        let count = 10;
        for (let i in this.ships) {
            let ship = this.ships[i];
            if (ship.active == true)
                continue;
            let planet = this.planets[startIdx];
            ship.pos[0] = planet.center[0] + Utils.Range(-planet.radius >> 1, planet.radius >> 1);
            ship.pos[1] = planet.center[1] + Utils.Range(-planet.radius >> 1, planet.radius >> 1);

            count++;
            if (count == 10)
                return;
        }

        this.startIdx = this.endIdx = -1;
    }

    Draw(gameRes) {
        //gameRes.RenderText("world", 100, 100, 100);
        for (let i in this.planets) {
            this.planets[i].Draw(gameRes);
        }

        for (let i in this.ships) {
            this.ships[i].Draw(gameRes);
        }
    }
}