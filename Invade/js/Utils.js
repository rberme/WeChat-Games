

export default class Utils {

}

Utils.MULTI = 512;

Utils.Normalize = function (vec) {
    let len = Utils.Sqrt1(vec[0] * vec[0] + vec[1] * vec[1]) / Utils.MULTI;
    let x = Math.round(vec[0] / len);
    let y = Math.round(vec[1] / len);
    return [x, y];
}

Utils.Length = function (vec1, vec2) {
    let x = vec1[0] - vec2[0];
    let y = vec1[1] - vec2[1];
    return Utils.Sqrt1(x * x + y * y)
}

//https://en.wikipedia.org/wiki/Integer_square_root
Utils.Sqrt1 = function (num) {
    if (num <= 0)
        return 0;
    else if (num < 2)
        return num;
    else {
        let smallCandidate = Utils.Sqrt1(Utils.Div(num, 4)) * 2;
        let largeCandidate = smallCandidate + 1
        if (largeCandidate * largeCandidate > num)
            return smallCandidate;
        else return largeCandidate;
    }
}

//https://en.wikipedia.org/wiki/Integer_square_root
Utils.Sqrt2 = function (num) {
    if (num < 0)
        return 0;

    let shift = 2;
    let nShifted = (num >> shift);
    while (nShifted != 0 && nShifted != num) {
        shift += 2;
        nShifted = (num >> shift);
    }
    shift -= 2;
    let result = 0;
    while (shift >= 0) {
        result <<= 1;
        let candidateResult = result + 1;
        if (candidateResult * candidateResult <= n >> shift)
            result = candidateResult;
        shift -= 2;
    }

    return result;
}

Utils.Div = function (num1, num2) {
    num1 = num1 - (num1 % num2);
    return Math.floor(num1 / num2 + 0.1);
}

Utils.Dot = function (vec1, vec2) {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1]
}

Utils.Abs = function (num) {
    return (num >= 0 ? num : -num);
}

Utils.Clamp = function (num, min, max) {
    if (num < min) num = min;
    if (num > max) num = max;
    return num;
}



// Utils.Angle = function (vec1, vec2) {
//     vec1 = Utils.Normalize(vec1);
//     vec2 = Utils.Normalize(vec2);
//     dot = Utils.Clamp(Utils.Dot(vec1, vec2), -Utils.MULTI,Utils.MULTI);
//     if (dot == 1) return 0;
//     else if (dot == -1) return 180;
//     return Math
// }