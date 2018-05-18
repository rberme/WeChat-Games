
import Utils from "./Utils"



export default class Planet {
    constructor(center, radius, id, humans, owner = 0) {
        this.radius = radius;
        this.center = center;
        this.checkDist = Utils.Div(this.radius, 2);
        this.id = id;

        this.humans = humans;
        this.owner = owner;
        this.color = "gray";
        this.maxHuman = 0;
        this.accGrow = this.grow = 0;

        this.rect = [this.center[0] - this.radius, this.center[1] - this.radius,
        this.radius << 1, this.radius << 1];

        this.renderHumans = this.humans;

        // this.launchHuman = 0;
        // this.launchedHuman = 0;
        // this.launchTarget = -1;
    }

    FilterDir(pos, dir) {

        let touchDist = Utils.Length(this.center, pos) - this.radius;
        touchDist = (touchDist < 0 ? 0 : touchDist);
        let toCenterDir = Utils.Normalize([this.center[0] - pos[0], this.center[1] - pos[1]]);
        let centerComponent = Utils.Dot(dir, toCenterDir);
        if (centerComponent > 0 && touchDist < this.checkDist) {
            let multiSquare = ((1 << Utils.MULTI) << Utils.MULTI);
            let temp = [Utils.Div(centerComponent * toCenterDir[0], multiSquare), Utils.Div(centerComponent * toCenterDir[1], multiSquare)];
            let ratio = Utils.MULTIV - Utils.Div(touchDist << Utils.MULTI, this.checkDist);
            return Utils.Normalize([dir[0] - Utils.Div(temp[0] * ratio, Utils.MULTIV), dir[1] - Utils.Div(temp[1] * ratio, Utils.MULTIV)]);
        }
        return dir;
    }

    Invade(ownerShip, humans) {
        if (this.owner == ownerShip.owner) {
            this.humans += humans;
            return;
        }
        if (humans >= this.humans) {
            this.owner = ownerShip.owner;
            this.color = ownerShip.color;
            this.humans = humans - this.humans;
        }
        else {
            this.humans -= humans
        }
    }

    Launch() {
        let lunchHuman = (this.humans >> 1);
        this.humans -= lunchHuman;

        return lunchHuman
    }

    Update(frame) {
        if (this.humans > this.maxHuman) {
            this.accGrow -= this.grow;
            if (this.accGrow <= 0) {
                this.accGrow += 1000;
                this.humans -= 1;
            }
            return;
        }

        if (this.owner > 0) {
            this.accGrow += this.grow;
            if (this.accGrow >= 1000) {
                this.accGrow -= 1000;
                this.humans += 1
            }
        }

        // if (this.launchHuman > 0) {
        //     if (this.launchHuman > 4) {
        //         this.launchedHuman += 4;
        //         this.launchHuman -= 4;

        //     } else {
        //         this.launchedHuman += this.launchHuman;
        //         this.launchHuman = 0;
        //     }
        // }
    }


    Draw(gameRes) {

        gameRes.DrawCircle(this.center, this.radius, this.color);
        gameRes.RenderText("ID: " + this.id, [this.center[0], this.center[1] - 4000], 5, "white");
        gameRes.RenderText("Owner: " + this.owner, this.center, 5, "white");

        if (this.renderHumans < this.humans) {
            this.renderHumans += Utils.SHIPHUMANS;
            if (this.renderHumans > this.humans)
                this.renderHumans = this.humans
        } else if (this.renderHumans > this.humans) {
            this.renderHumans -= Utils.SHIPHUMANS
            if (this.renderHumans < this.humans)
                this.renderHumans = this.humans
        }
        gameRes.RenderText("Humans: " + this.renderHumans, [this.center[0], this.center[1] + 4000], 5, "white");
    }
}