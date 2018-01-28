
import {
    CUTSCENE,
} from '../Misc/GameRes'

const pacmanAnim = [
    3, 5, 3, 6,//pacman左
    7, 8, 7, 6,//pacman右
    54, 55, 56, 55,//pacman右大 //
    18, 19, 20, 21,//red左右

    57, 58, 59, 60, 61, //stick /
    62, 63,//21
    64,65,//缝补 red左   23
    66,67,//虫子    25
];

const Dir2Anim = {
    1: 0,
    2: 1,
    4: 2,
    8: 3,
}

const PM_MOVEMENTS = {
    0: {
        axis: 0,
        increment: 0
    },
    4: {//左
        axis: 0,
        increment: -1
    },
    8: {//右
        axis: 0,
        increment: +1
    },
    1: {//上
        axis: 1,
        increment: -1
    },
    2: {//下
        axis: 1,
        increment: +1
    }
}

const DEFAULT_FPS = 60;


class CutsceneActor {
    constructor(mainRef) {
        this.mainRef = mainRef;
    }

    update() {
        if (this.id == 99) {//pacman 左
            this.animIdx = Math.floor(this.mainRef.frame / 3) % 4;
        } else if (this.id == 1) {//red 左
            this.animIdx = 12 + Math.floor(this.mainRef.frame / 3) % 2;
        } else if (this.id == 2) {//red 右
            this.animIdx = 14 + Math.floor(this.mainRef.frame / 3) % 2;
        } else if (this.id == 3) {//钉子
            this.animIdx = 16
        } else if (this.id == 4) {//钉子
            this.animIdx = 17
        } else if (this.id == 7) {//钉子
            this.animIdx = 18
        } else if (this.id == 8) {//钉子
            this.animIdx = 19
        } else if (this.id == 9) {//钉子
            this.animIdx = 20
        } else if (this.id == 5) { //大pacman 右
            this.animIdx = 8 + Math.floor(this.mainRef.frame / 3) % 4;
        } else if (this.id == 6) { //pacman 右
            this.animIdx = 4 + Math.floor(this.mainRef.frame / 3) % 4;
        } else if (this.id == 10) {//受伤 red
            this.animIdx = 21
        } else if (this.id == 11) {//受伤 red
            this.animIdx = 22
        } else if (this.id == 23) {//red 左 慢
            this.animIdx = 12 + Math.floor(this.mainRef.frame / 6) % 2;
        } else if (this.id == 24) {//red 左 缝补
            this.animIdx = 23 + Math.floor(this.mainRef.frame / 5) % 2;
        } else if (this.id == 25) {//red 虫子 右
            this.animIdx = 25 + Math.floor(this.mainRef.frame / 6) % 2;
        }
    }

    render(gameRes) {
        let animID = this.animIdx;
        gameRes.renderImage(pacmanAnim[animID], this.pos[0], this.pos[1] + this.mainRef.worldMap.playfieldY, 1, 1);
    }

}

export default class Cutscene {
    constructor(mainRef) {
        this.mainRef = mainRef;
        this.startCutscene();
    }


    startCutscene() {
        this.cutscene = CUTSCENE[this.mainRef.cutsceneId];
        this.cutsceneActors = [];
        this.cutsceneSequenceId = -1;
        for (let k in this.cutscene.actors) {
            //let actorId = this.cutscene.actors[k].id;
            //if (actorId > 0) actorId += this.playerCount - 1;
            let actor = new CutsceneActor(this.mainRef);
            actor.pos = [this.cutscene.actors[k].x * 8 + 4, this.cutscene.actors[k].y * 8 + 4];
            actor.ghost = this.cutscene.actors[k].ghost;
            this.cutsceneActors.push(actor);
        }
        this.cutsceneNextSequence();
        this.update();
    }

    stopCutscene() {
        this.mainRef.newLevel(false);
    }

    update() {
        this.updateCutscene();
        for (let k in this.cutsceneActors) {
            this.cutsceneActors[k].update();
        }
    }

    render(gameRes) {
        for (let k in this.cutsceneActors) {
            this.cutsceneActors[k].render(gameRes);
        }
    }
    updateCutscene() {
        for (var b in this.cutsceneActors) {
            var c = this.cutsceneActors[b],
                d = PM_MOVEMENTS[c.dir];
            c.pos[d.axis] += d.increment * c.speed * 1.5;
        }
        this.cutsceneTime--
        if (this.cutsceneTime <= 0)
            this.cutsceneNextSequence()
    };

    cutsceneNextSequence() {
        this.cutsceneSequenceId++;
        if (this.cutscene.sequence.length == this.cutsceneSequenceId)
            this.stopCutscene();
        else {
            var seq = this.cutscene.sequence[this.cutsceneSequenceId];
            this.cutsceneTime = seq.time * DEFAULT_FPS;
            for (var k in this.cutsceneActors) {
                var actor = this.cutsceneActors[k];
                actor.dir = seq.moves[k].dir;
                actor.speed = seq.moves[k].speed;
                if (seq.moves[k].id)
                    actor.id = seq.moves[k].id;
                // if (seq.moves[k].elId)
                //     actor.cutSceneId = seq.moves[k].elId;
                // if (seq.moves[k].mode)
                //     actor.mode = seq.moves[k].mode;
            }
        }
    }
}