
const assert = require("assert");
const Primitive2Lua = require('./src/Primitive2Lua');
const prim_array_data = require("./demo/actions.json");

//执行原语数组检查
function testPrim2Lua() {
    let script = Primitive2Lua("Task_1234", prim_array_data);
    assert.ok(script.length>10);
    console.log(script);
}

assert.doesNotThrow(testPrim2Lua, undefined, "测试未通过");