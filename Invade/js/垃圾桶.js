

    // MoveOne() {
    //     if (this.endIdx < 0) {
    //         this.startIdx = -1;
    //         return;
    //     }
    //     let count = 30;
    //     for (let i = 0; i < count; ++i) {
    //         let ship = this.ships.pop();
    //         if (ship == null)
    //             break;
    //         let planet = this.planets[this.startIdx];
    //         ship.pos[0] = planet.center[0] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
    //         ship.pos[1] = planet.center[1] + rand.Range(-planet.radius >> 1, planet.radius >> 1);

    //         planet = this.planets[this.endIdx];
    //         ship.target[0] = planet.center[0] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
    //         ship.target[1] = planet.center[1] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
    //         ship.startIdx = this.startIdx;
    //         ship.endIdx = this.endIdx;

    //         ship.active = true;

    //         this.waitShips.push(ship);


    //     }
    //     this.startIdx = this.endIdx = -1;
    // }




    // MoveAll() {
    //     let count = 10;
    //     for (let t = 0; t < arguments.length; t += 2) {
    //         let startIdx = arguments[t];
    //         let endIdx = arguments[t + 1];

    //         for (let i = 0; i < count; ++i) {
    //             let ship = this.ships.pop();
    //             if (ship == null)
    //                 break;
    //             let planet = this.planets[startIdx];
    //             ship.pos[0] = planet.center[0] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
    //             ship.pos[1] = planet.center[1] + rand.Range(-planet.radius >> 1, planet.radius >> 1);

    //             planet = this.planets[endIdx];
    //             ship.target[0] = planet.center[0] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
    //             ship.target[1] = planet.center[1] + rand.Range(-planet.radius >> 1, planet.radius >> 1);
    //             ship.startIdx = startIdx;
    //             ship.endIdx = endIdx;

    //             ship.active = true;
    //             this.waitShips.push(ship);
    //         }
    //     }
    // }




// for (let i in this.planets) {
//     let planet = this.planets[i];
//     planet.Update(frame);
//     // while (planet.launchedHuman > 7) {
//     //     planet.launchedHuman -= 7;
//     //     this.ShipLaunch(planet.owner, planet.id, planet.launchTarget, 7);
//     // }
//     // if (planet.launchedHuman > 0 && planet.launchHuman == 0) {
//     //     this.ShipLaunch(planet.owner, planet.id, planet.launchedHuman);
//     //     planet.launchedHuman = 0;
//     // }
// }

    // MoveStart(pos) {
    //     for (let i in this.planets) {
    //         let planet = this.planets[i];
    //         let dx = (pos[0] * Utils.MULTI) - planet.center[0];
    //         let dy = (pos[1] * Utils.MULTI) - planet.center[1];
    //         if ((dx * dx + dy * dy) < planet.radius * planet.radius) {
    //             this.fingerPos[0] = planet.center;
    //             return i;
    //         }
    //     }
    //     return -1;
    // }

    // Moving(pos, startIdx) {
    //     if (startIdx < 0)
    //         return -1;
    //     this.fingerPos[0] = pos[0] * Utils.MULTI;
    //     this.fingerPos[1] = pos[1] * Utils.MULTI;
    //     this.endIdx = -1;
    //     for (let i in this.planets) {
    //         if (i == startIdx)
    //             continue;
    //         let planet = this.planets[i];
    //         let dx = (pos[0] * Utils.MULTI) - planet.center[0];
    //         let dy = (pos[1] * Utils.MULTI) - planet.center[1];
    //         if ((dx * dx + dy * dy) < planet.radius * planet.radius) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // }
