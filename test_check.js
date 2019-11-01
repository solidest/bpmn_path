
const checkPrimitive = require('./src/CheckPrimitive');
const primarray_demo = require("./handbook/demo/demo.json");

//执行原语数组检查
function doCheck() {
    let results = checkPrimitive(primarray_demo);
    assert.ok(results.length===1);
    for(let r of results) {
        console.log(r);
    }
}


assert.doesNotThrow(doCheck, undefined, "测试通过");