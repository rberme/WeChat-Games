

const bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
const floatView = new Float32Array(bytes);
const intView = new Uint32Array(bytes);
const threehalfs = 1.5;

export default class Utils {

}


Utils.Q_Sqrt = function (num) {
    //return Math.sqrt(num);
    const x2 = num * 0.5;
    floatView[0] = num;
    intView[0] = 0x5f3759df - (intView[0] >> 1);
    let y = floatView[0];
    y = y * (threehalfs - (x2 * y * y));
    return (1 / y);
}


Utils.Normalize = function (vec) {
    //let len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    let len = Utils.Q_Sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    vec[0] /= len;
    vec[1] /= len;
    return len;
}