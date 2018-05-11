import Utils from "./Utils"

export default class Spaceship {
    constructor(pos) {
        this.pos = pos;
        this.Dir = [Utils.MULTI, 0];
        this.speed = 3;
        this.target = null;
    }

    Update(frame) {
        if (this.target != null) {
            let normDir = Utils.Normalize(this.Dir);
            this.pos[0] += this.speed * normDir[0];
            this.pos[1] += this.speed * normDir[1];
        }
    }

    Draw(gameRes) {
        //gameRes.RenderText("world", 100, 100, 100);
        gameRes.DrawCircle(this.pos, 5 * Utils.MULTI);
    }

}