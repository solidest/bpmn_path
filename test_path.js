const assert = require("assert");
const createMap = require('./src/MapGraph');
const createPathBook = require('./src/PathBook');
const bpmn_demo = require("./demo/demo.json");

async function test_createPathes(depth) {

    let map = await createMap(depth,  bpmn_demo.xml);
    let pathes = map.createPathes();

    assert.ok(pathes);
    console.log("\n==========生成路径总数：", pathes.length, "===========");
    let index = 1;
    for(let i of pathes) {
        let find = 0;
        for(let ii of pathes) {
            let len1 = ii.length;
            let len2 = i.length;
            if(len1===len2) {
                let same = true;
                for(let idx=0; idx<len1; idx++) {
                    if(ii[idx]!==i[idx]) {
                        same = false;
                        break;
                    }
                }
                if(same) {
                    find += 1;
                }
            }
        }
        assert.ok(find===1);
        console.log(index, ':', createPathBook(i));
        index+=1;
    }
}

async function test() {
    await test_createPathes(0);
    await test_createPathes(2);
}

assert.doesNotThrow(test, undefined, "测试通过");