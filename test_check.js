
const assert = require("assert");
const checkPrimitive = require('./src/CheckPrimitive');
const checkProtocol = require('./src/CheckProtocol');
const checkInterface = require('./src/CheckInterface');
const prim_array_data = require("./demo/actions.json");

//执行原语数组检查
function testCheck() {

    let results1 = checkPrimitive("Task_1234", prim_array_data);
    //assert.ok(results.length===1);
    for(let r of results1) {
        console.log(r);
    }


    let results2 = checkProtocol("Task_1234", prim_array_data, ["pr_GPS"]);
    assert.ok(results2.length===1);
    for(let r of results2) {
        console.log(r);
    }


    let results3 = checkInterface("Task_1234", prim_array_data, ["ch_GPS", "ch_dio", "ch_analogy"])    
    for(let r of results3) {
        console.log(r);
    }

}
assert.doesNotThrow(testCheck, undefined, "测试未通过");