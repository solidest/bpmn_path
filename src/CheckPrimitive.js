
//检查recv原语设置是否正确
function checkRecv(prim) {
    if(!prim) {
        return null;
    }
    //TODO

    return null;
}

//检查send原语设置是否正确
function checkSend(prim) {
    if(!prim) {
        return null;
    }
    //TODO

    return null;
 }

//检查assert原语设置是否正确
function checkAssert(prim) {

    if(!prim || !prim.assert_type) {
        return null;
    }
    switch (prim.assert_type) {
        case "ok":
            if(!prim.expression) {
                return "未设置断言表达式";
            }
            break;

        case "changeHigh":
        case "changeLow":
            if(!prim.vchannel) {
                return "未设置断言通道";
            }
            if(!prim.timeout) {
                return "未设置断言超时时长"
            }
            break;
    
        default:
            break;
    }
    return null;
}

//将每个原语的检查函数都放到一个字典里
const checker = {
    "recv": checkRecv,
    "send": checkSend,
    "assert": checkAssert,
}

//对单个task中的所有原语执行检查，返回检查结果
function CheckPrimitive(task_id, prim_array) {
    let result = [];
    if(!prim_array || prim_array.length===0) {
        return result;
    }

    let idx = 0;
    for(let prim of prim_array) {
        let check_fun = checker[prim.action];
        if(check_fun) {
            let info = check_fun(prim.setting);
            if(info) {
                result.push({
                    task_id: task_id,
                    pri_idx: idx,
                    type: "error",
                    info: info
                });
            }
        } else {
            console.log(`未执行对<${prim.action}>原语的检查`)
        }
        idx++;
    }
    return result;
}

module.exports = CheckPrimitive;
