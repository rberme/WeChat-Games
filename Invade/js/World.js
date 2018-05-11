import Planet from "./Planet"
import Spaceship from "./Spaceship"
import Random from "./Random"
import Utils from "./Utils"



let rand = new Random();

export default class World { 
    constructor() {
        this.CreatePlanets();
        this.CreateShips();
    }

    CreatePlanets() {
        this.planets = [];
        this.planets[0] = new Planet([333 * Utils.MULTI, 188 * Utils.MULTI], 80 * Utils.MULTI)
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
            ship.Dir = [ship.target[0] - ship.pos[0], ship.target[1] - ship.pos[1]];
            ship.Dir = this.planets[0].FilterDir(ship.pos, ship.Dir);
            this.ships[i].Update(frame);
        }
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