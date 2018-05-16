import Utils from "./Utils"

export default class Spaceship {
    constructor(pos) {
        this.pos = pos;
        this.Dir = [Utils.MULTI, 0];
        this.speed = 3;
        this.target = null;
        this.active = false;

        this.lastPos = [0, 0];

        this.frameDelta = [0, 0];
        this.renderPos = [0, 0];

        this.maxFrame = 0;
        this.currFrame = 0;

    }

    ResetDir() {
        this.Dir = [this.target[0] - this.pos[0], this.target[1] - this.pos[1]];
    }

    Update(frame) {
        //if (this.active == true && this.target != null) {
        //let normDir = Utils.Normalize(this.Dir);
        //this.pos[0] += this.speed * normDir[0];
        //this.pos[1] += this.speed * normDir[1];


        let normDir = this.Dir;//Utils.Normalize(this.Dir);
        this.frameDelta[0] = this.speed * frame * normDir[0];
        this.frameDelta[1] = this.speed * frame * normDir[1];

        this.lastPos[0] = this.pos[0];
        this.lastPos[1] = this.pos[1];
        this.pos[0] += this.frameDelta[0];
        this.pos[1] += this.frameDelta[1];

        this.maxFrame = frame;
        this.currFrame = 0;

        if (Utils.Abs(this.target[0] - this.pos[0]) < 4000 &&
            Utils.Abs(this.target[1] - this.pos[1]) < 4000)
            return false;
        return true;
    }

    Draw(gameRes) {
        // if (this.active == false)
        //     return;
        //gameRes.RenderText("world", 100, 100, 100);

        this.renderPos[0] = this.lastPos[0] + this.frameDelta[0] * this.currFrame / this.maxFrame;
        this.renderPos[1] = this.lastPos[1] + this.frameDelta[1] * this.currFrame / this.maxFrame;
        if (this.currFrame < this.maxFrame)
            this.currFrame++;
        gameRes.DrawCircle(this.renderPos, 5 * Utils.MULTI);
        return true;
    }

}