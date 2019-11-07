
const assert = require("assert");
const checkPrimitive = require('./src/CheckPrimitive');
const prim_array_data = require("./demo/actions.json");

//执行原语数组检查
function testCheck() {

    let results = checkPrimitive("Task_1234", prim_array_data);
    //assert.ok(results.length===1);

    for(let r of results) {
        console.log(r);
    }
}
testCheck();
//assert.doesNotThrow(testCheck, undefined, "测试未通过");