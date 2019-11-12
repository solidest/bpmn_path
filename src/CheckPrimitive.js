//检查recv原语设置是否正确
function checkRecv(prim) {
    if (!prim) {
        return null;
    }

    if (!prim.schannel) {
        return "未设置接收数据的通道";
    }
    
    if (!prim.protocol) {
        return "未设置发送动作使用的协议";
    }
    if (!prim.timeout) {
        return "未设置超时时间";
    }
    if (!prim.binding) {
        return "未设置协议字段与参数绑定关系";
    } else {
        let indexx = 1;
        for (let primx of prim.binding) {
            var text1 = indexx;
            if (!primx.name) {
                return "第" + indexx + "行未设置协议字段名";
            }
            if (!primx.bindtype) {
                return "第" + indexx + "行未设置绑定方式";
            }
            if (primx.name != "coordinate") {
                if (!primx.vbind) {
                    return "第" + indexx + "行未设置绑定值";
                }
            }
            indexx++;
        }
    }

    return null;
}


//检查delay原语设置是否正确
function checkDelay(prim) {
    if (!prim) {
        return null;
    }

    if ((!prim.manual_continue) && (!prim.timeout)) {
        return "未设置延时方式";
    }

    return null;
}

//检查send原语设置是否正确
function checkSend(prim) {
    if (!prim) {
        return null;
    }
    if (!prim.schannel) {
        return "未设置send通道";
    }

    if (!prim.protocol) {
        return "未设置send协议";
    }
    if (!prim.binding) {
        return "未设置协议字段与参数绑定关系";
    } else {
        //console.log("对协议的检查");
        let indexx = 1;
        for (let primx of prim.binding) {
            var text1 = indexx;
            if (!primx.name) {
                return "第" + indexx + "行未设置协议字段名";
            }
            if (!primx.bindtype) {
                return "第" + indexx + "行未设置绑定方式";
            }
            if (primx.name != "coordinate") {
                if (!primx.vbind) {
                    return "第" + indexx + "行未设置绑定值";
                }
            }
            indexx++;
        }
    }

    //TODO

    return null;
}

//检查assert原语设置是否正确
function checkAssert(prim) {

    if (!prim || !prim.assert_type) {
        return null;
    }
    switch (prim.assert_type) {
        case "ok":
            if (!prim.expression) {
                return "未设置断言表达式";
            }
            break;

        case "changeHigh":
        case "changeLow":
            if (!prim.vchannel) {
                return "未设置断言通道";
            }
            if (!prim.timeout) {
                return "未设置断言超时时长"
            }
            break;

        default:
            break;
    }
    return null;
}

//检查read原语设置是否正确
function checkRead(prim) {
    if (!prim) {
        return null;
    }
    if (!prim.vchannel) {
        return "未设置要读取的通道";
    }
    if (!prim.para) {
        return "未设置读取结果要赋值的参数";
    }
    //TODO

    return null;
}

//检查write原语设置是否正确
function checkWrite(prim) {
    if (!prim) {
        return null;
    }
    if (!prim.vchannel) {
        return "未设置要写入的通道";
    }
    if (!prim.para) {
        return "未设置要写入的参数";
    }
    //TODO

    return null;
}


//检查print原语设置是否正确
function checkPrint(prim) {
    if (!prim) {
        return null;
    }
    if (!prim.info) {
        return "未设置要打印的输出信息";
    }

    return null;
}

//检查reset原语设置是否正确
function checkReset(prim) {
    if (!prim) {
        return null;
    }
    if (!prim.reset) {
        return "未设置要重置的通道";
    }

    return null;
}

//检查call原语设置是否正确
function checkCall(prim) {
    if (!prim) {
        return null;
    }
    if (!prim.fun) {
        return "未设置被调用的函数名";
    }


    return null;
}

//将每个原语的检查函数都放到一个字典里
const checker = {
    "recv": checkRecv,
    "send": checkSend,
    "assert": checkAssert,
    "read": checkRead,
    "write": checkWrite,
    "delay": checkDelay,
    "print": checkPrint,
    "reset": checkReset,
    "call": checkCall,
}

//对单个task中的所有原语执行检查，返回检查结果
function CheckPrimitive(task_id, prim_array) {
    let result = [];
    if (!prim_array || prim_array.length === 0) {
        return result;
    }

    let idx = 0;
    for (let prim of prim_array) {
        let check_fun = checker[prim.action];
        if (check_fun) {
            let info = check_fun(prim.setting);
            if (info) {
                result.push({
                    task_id: task_id,
                    pri_idx: idx,
                    type: "error",
                    action_type: prim.action,
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