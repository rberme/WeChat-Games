


export default class Line {
    constructor() {
        this.start = [0, 0];
        this.dir = [0, 0];
        this.len = 800;
        this.isAble = false;
    }

    Init(start, dir) {
        this.start = start;
        this.dir = dir;
        this.len = 800;
        this.isAble = false;
    }

    LenReset() {
        this.len = 800;
    }


    Update(frame) {


    }


    Render(gameRes) {
        if (this.isAble == false)
            return;
        gameRes.DrawLine(this.start,
            [this.start[0] + this.dir[0] * this.len,
            this.start[1] + this.dir[1] * this.len]);
    }
}