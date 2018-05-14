import Utils from "./Utils"

let instance;
export default class Random {
    constructor() {
        if (instance)
            return instance;
        this.seed(49734321);
        instance = this;

    }

    rand() {
        var t32 = 0x100000000;
        var constant = 134775813;
        var x = (constant * this.randSeed + 1);
        return (this.randSeed = x % t32) / t32;
    };

    seed(b) {
        this.seed = b
    };

    Range(min, max) {
        let delta = max - min;
        if (delta > 0) {
            let r = this.Next();
            return min + r % delta;
        }
        return min;
    }

    Next() {
        this.seed = ((this.seed + 0x7ed55d16) + (seed << 12)) & 0xffffffff;
        this.seed = ((this.seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
        this.seed = ((this.seed + 0x165667b1) + (seed << 5)) & 0xffffffff;
        this.seed = ((this.seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
        this.seed = ((this.seed + 0xfd7046c5) + (seed << 3)) & 0xffffffff;
        this.seed = ((this.seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
        return (seed & 0xfffffff) / 0x10000000;
    }
}