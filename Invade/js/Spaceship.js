import Utils from "./Utils"

export default class Spaceship {
    constructor(pos) {
        this.pos = pos;
        this.Dir = [Utils.MULTI, 0];
        this.speed = 3;
        this.target = null;
        this.active = false;
    }

    Update(frame) {
        if (this.active == true && this.target != null) {
            let normDir = Utils.Normalize(this.Dir);
            this.pos[0] += this.speed * normDir[0];
            this.pos[1] += this.speed * normDir[1];

            if( Utils.Abs(this.target[0]-this.pos[0])<10 && 
                Utils.Abs(this.target[1]-this.pos[1])<10)
                this.active = false;
        }
    }

    Draw(gameRes) {
        if (this.active == false)
            return;
        //gameRes.RenderText("world", 100, 100, 100);
        gameRes.DrawCircle(this.pos, 5 * Utils.MULTI);
    }

}