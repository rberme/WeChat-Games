
import Utils from "./Utils"



export default class Planet {
    constructor(center, radius, id) {
        this.radius = radius;
        this.center = center;
        this.checkDist = Utils.Div(this.radius, 2);
        this.id = id;
    }

    FilterDir(pos, dir) {
        dir = Utils.Normalize(dir);
        let touchDist = Utils.Length(this.center, pos) - this.radius;
        let toCenterDir = Utils.Normalize([this.center[0] - pos[0], this.center[1] - pos[1]]);
        let centerComponent = this.Cos(dir, toCenterDir);
        if (centerComponent > 0 && touchDist < this.checkDist) {
            let multiSquare = Utils.MULTI * Utils.MULTI;
            let temp = [Utils.Div(centerComponent * toCenterDir[0], multiSquare), Utils.Div(centerComponent * toCenterDir[1], multiSquare)];
            // 1-(touchDist/this.checkDist);
            let ratio = Utils.MULTI - Utils.Div(Utils.MULTI * touchDist, this.checkDist);
            return Utils.Normalize([dir[0] - Utils.Div(temp[0] * ratio, Utils.MULTI), dir[1] - Utils.Div(temp[1] * ratio, Utils.MULTI)]);
        }
        return dir;
    }

    Cos(vec1, vec2) {
        vec1 = Utils.Normalize(vec1);
        vec2 = Utils.Normalize(vec2);
        let dot = Utils.Dot(vec1, vec2)//Utils.Clamp(Utils.Dot(vec1, vec2), -Utils.MULTI, Utils.MULTI);
        return dot
    }


    Draw(gameRes) {
        //gameRes.RenderText("world", 100, 100, 100);
        gameRes.DrawCircle(this.center, this.radius);
    }
}