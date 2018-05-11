

let instance;
export default class Random {
    constructor() {
        if (instance)
            return instance;
        this.seed(123456);
        instance = this;

    }

    rand() {
        var t32 = 0x100000000;
        var constant = 134775813;
        var x = (constant * this.randSeed + 1);
        return (this.randSeed = x % t32) / t32;
    };

    seed(b) {
        this.randSeed = b
    };

    Range(min, max) {
        let delta = max - min;
        if (delta > 0) {
            let r = this.rand();
            return min + Math.floor(r * delta);
        }
        return min;
    }
}