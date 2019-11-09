
const binParser = require("../parser/BinParser");


//helper for 处理表达式
function handleExp(str_exp) {
    let ast = binParser.parse(str_exp);
    return ast.value_text("argv");
}

//获取recv原语的脚本
function getRecvScript(prim) {
    //TODO
    //return ["--TODO getRecvScript"]
}

//获取send原语的脚本
function getSendScript(prim) {
    //TODO
    //return ["--TODO getRecvScript"]
 }

//获取assert原语的脚本
function getAssertScript(prim) {
    let scripts = [];
    switch (prim.assert_type) {
        case "ok":

            //如果原语已经通过检查则这里不需要再次检查
            //仅未测试目的加入本段代码
            if(!prim.expression) {
                return scripts;
            }

            scripts.push(`assert.ok(${handleExp(prim.expression)}, ${'"断言\\"'+prim.expression+'\\"失败"'})`);
            break;

        case "changeHigh":
            //TODO
            //scripts.push("--TODO assert.changeHigh");
            break;

        case "changeLow":
            //TODO
            //scripts.push("--TODO assert.changeLow");
            break;
    
        default:
            break;
    }
    return scripts;
}

//将每个原语的脚本生成函数都放到一个字典里
const generator = {
    "recv": getRecvScript,
    "send": getSendScript,
    "assert": getAssertScript,
}

//将task中的所有原语执行生成一个函数
function Primitive2Lua(task_id, prim_array) {
    let script_arr = [];
    if(!prim_array || prim_array.length===0) {
        return '';
    }

    for(let prim of prim_array) {
        let get_fun = generator[prim.action];
        if(get_fun) {
            let prim_script = get_fun(prim.setting);
            if(prim_script && prim_script.length>0) {
                script_arr = script_arr.concat(prim_script);
            }
        } else {
            console.log(`未执行对<${prim.action}>原语的脚本转换`)
        }
    }

    return `function ${task_id}(argv)\n\t${script_arr.join('\n\t')}\nend`;
}

module.exports = Primitive2Lua;
