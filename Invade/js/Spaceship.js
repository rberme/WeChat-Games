import Utils from "./Utils"

export default class Spaceship {
    constructor(pos) {
        this.pos = pos;
        this.Dir = [Utils.MULTIV, 0];
        this.speed = 3;
        this.target = null;
        this.active = false;

        this.lastPos = [0, 0];

        this.frameDelta = [0, 0];

        this.maxFrame = 0;
        this.currFrame = 0;

        this.size = (5 << Utils.MULTI);

        this.rect = [
            this.pos[0] - this.size, this.pos[1] - this.size,
            this.size << 1, this.size << 1
        ];
    }

    ResetInfo(ownerPlanet, humans) {
        this.owner = ownerPlanet.owner;
        this.color = ownerPlanet.color;
        this.humans = humans;
    }

    ResetDir() {
        this.Dir = [this.target[0] - this.pos[0], this.target[1] - this.pos[1]];
    }

    Update(frame) {

        let normDir = this.Dir;
        this.frameDelta[0] = this.speed * frame * normDir[0];
        this.frameDelta[1] = this.speed * frame * normDir[1];

        this.lastPos[0] = this.pos[0];
        this.lastPos[1] = this.pos[1];
        this.pos[0] += this.frameDelta[0];
        this.pos[1] += this.frameDelta[1];
        this.rect[0] = this.pos[0] - this.size;
        this.rect[1] = this.pos[1] - this.size;

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
        let renderPos = [];
        renderPos[0] = this.lastPos[0] + this.frameDelta[0] * this.currFrame / this.maxFrame;
        renderPos[1] = this.lastPos[1] + this.frameDelta[1] * this.currFrame / this.maxFrame;
        if (this.currFrame < this.maxFrame)
            this.currFrame++;
        gameRes.DrawCircle(renderPos, this.size);
        return true;
    }

}