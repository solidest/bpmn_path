
const assert = require("assert");
const Primitive2Lua = require('./src/Primitive2Lua');
const prim_array_data = require("./demo/actions.json");

//查找错误的行号对应的动作原语编号
//primDict是保存原语和代码行号关系的字典
//lineNum是错误代码行号
function getWrongPrim(primDict, lineNum) {
	for (let i =0;i <  primDict.length;i++) {
		if(lineNum <= primDict[i][1] && lineNum > primDict[i][0]) {
			return i;
		}
	}
	return -1;
}

//执行原语脚本生成
function testPrim2Lua() {
    let result = Primitive2Lua("Task_1234", prim_array_data, ["para1", "para2", "para3"]);
    //assert.ok(script.length>10);
    //console.log(result);
    console.log(result[0].join("\n"));
    wrongPrimID = getWrongPrim(result[1], 6)
    console.log("如果第6行代码出错，对应的动作原语编号为" + wrongPrimID);
}

assert.doesNotThrow(testPrim2Lua, undefined, "测试未通过");