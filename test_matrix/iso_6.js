// 6
var matA = [];
var matB = [];
matA.push("0 1 1 0 0 0".split(" "));
matA.push("1 0 1 0 1 1".split(" "));
matA.push("1 1 0 1 0 0".split(" "));
matA.push("0 0 1 0 0 0".split(" "));
matA.push("0 1 0 0 0 0".split(" "));
matA.push("0 1 0 0 0 0".split(" "));
matB.push("0 1 1 1 0 0".split(" "));
matB.push("1 0 0 0 0 0".split(" "));
matB.push("1 0 0 1 0 0".split(" "));
matB.push("1 0 1 0 1 1".split(" "));
matB.push("0 0 0 1 0 0".split(" "));
matB.push("0 0 0 1 0 0".split(" "));

createGraphFrom2DMatrix(6, matA, matB);
runAlgo(matA, matB);