const binParser = require("../parser/BinParser");


//helper for 处理表达式
function handleExp(str_exp) {
    let ast = binParser.parse(str_exp);
    return ast.value_text("argv");
}

//获取recv原语的脚本
function getRecvScript(prim) {
    
}

//获取send原语的脚本
function getSendScript(prim) {
    
}

//获取read原语的脚本
function getReadScript(prim) {
    let scripts = [];
    scripts.push(`\tread(${prim.vchannel})`);
    return scripts;
}

//获取write原语的脚本
function getWriteScript(prim) {
    let scripts = [];
    scripts.push(`\twrite(${prim.vchannel}, argv.${prim.para})`);
    return scripts;
}

//获取delay原语的脚本
function getDelayScript(prim) {
    let scripts = [];
    scripts.push(`\tdelay(${prim.timeout})`);
    return scripts;
}

//获取print原语的脚本
//重点是获取参数，在参数前面加argv.
function getPrintScript(prim) {
    let scripts = "\tprint(";
    let args = [];
    let infos = prim.info.split(/, |,/);
    for (let i = 0; i < infos.length; i++) {
        if (infos[i].includes("\"")) {
            if (infos[i].charAt(infos[i].length - 1) != "\"") {
                let tmp = infos[i];
                i++;
                args.push(tmp + "," + infos[i]);
            } else
                args.push(infos[i]);

        } else
            args.push(infos[i]);
    }
    //console.log(args);
    for (let i = 0; i < args.length; i++) {
        if (args[i].includes("\"")) 
            scripts = scripts + args[i];
        else 
            scripts = scripts + "argv." + args[i];
        
        if (i != args.length - 1)
            scripts = scripts + ", ";
        else
            scripts = scripts + ")";
        
    }


    return [scripts];
}

//获取reset原语的脚本
function getResetScript(prim) {
    let scripts = [];
    scripts.push(`\treset(${prim.schannel})`);
    return scripts;
}

//获取call原语的脚本
function getCallScript(prim) {
    let scripts = `\t${prim.fun}(`;
    argvs = prim.argv.split(/, |,/);
    for (let i = 0; i < argvs.length; i++) {
        scripts = scripts + "argv." + argvs[i];
        if (i != argvs.length - 1)
            scripts = scripts + ", ";
    }
    scripts = scripts + ")"
    //scripts.push(`\t${prim.fun}(${prim.argv})`);
    return [scripts];
}

//获取assert原语的脚本
function getAssertScript(prim) {
    let scripts = [];
    switch (prim.assert_type) {
        case "ok":

            //如果原语已经通过检查则这里不需要再次检查
            //仅未测试目的加入本段代码
            if (!prim.expression) {
                return scripts;
            }

            scripts.push(`\tassert.ok(${handleExp(prim.expression)}, ${'"断言\\"'+prim.expression+'\\"失败"'})`);
            break;

        case "changeHigh":
            scripts.push(`\tassert.changeHigh(${prim.vchannel}, ${prim.timeout}, ${'"断言\\"'+ prim.vchannel + '\\"接口电平值由低变高失败"'})`);
            break;

        case "changeLow":
            scripts.push(`\tassert.changeLow(${prim.vchannel}, ${prim.timeout}, ${'"断言\\"'+ prim.vchannel + '\\"接口电平值由高变低失败"'})`);
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
    "read": getReadScript,
    "write": getWriteScript,
    "delay": getDelayScript,
    "print": getPrintScript,
    "reset": getResetScript,
    "call": getCallScript,
}

//将task中的所有原语执行生成一个函数
function Primitive2Lua(task_id, prim_array) {
    let script_arr = [`function ${task_id}(argv)`];
    if (!prim_array || prim_array.length === 0) {
        return '';
    }
    //var primID = 0; //原语的ID
    let lineNum = 1; //代码行号
    let primDict = []; //查询原语用的字典
    for (let prim of prim_array) {
        let get_fun = generator[prim.action];
        if (get_fun) {
            let prim_script = get_fun(prim.setting);
            if (prim_script && prim_script.length > 0) {
                let tmp = lineNum;
                lineNum = lineNum + prim_script.length;
                primDict.push([tmp, lineNum]);
                script_arr = script_arr.concat(prim_script);
            }
            else
                primDict.push([lineNum, lineNum]);
        } else {
            console.log(`未执行对<${prim.action}>原语的脚本转换`);
        }
        //primID++;
    }

    end = [`end`];
    script_arr = script_arr.concat(end);
    return [script_arr, primDict];
}

module.exports = Primitive2Lua;