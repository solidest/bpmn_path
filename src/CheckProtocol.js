//检查动作原语对协议的引用是否正确 pt是全部协议的json
//这里暂时只对协议名称继续检查
//11.11加入对于整个协议的检查
function CheckProtocol(task_id, prim_array, pt) {
    //console.log(pt);
    if (!prim_array || prim_array.length === 0) {
        return "原语的协议检查中未发现原语";
    }
    if (!pt || pt.length === 0) {
        return "原语的协议检查中未发现协议";
    }
    let result = [];
    let cpt = []; //协议的名字数组
    for (let protocol of pt) {
        cpt.push(protocol.protocolName);
    }

    let idx = 0;
    for (let prim of prim_array) {
        if ((prim.action == "send") || (prim.action == "recv")) {
            //1、检查协议名
            if (!cpt.includes(prim.setting.protocol)) {
                result.push({
                    task_id: task_id,
                    pri_idx: idx,
                    type: "error",
                    action_type: prim.action,
                    info: `使用了未定义的协议"${prim.setting.protocol}"`
                });
            } else {
                //2、检查协议字段名
                var segments = prim.setting.binding;
                for (let protocol of pt) {
                    if (protocol.protocolName == prim.setting.protocol) {
                        rightSeg = protocol.segments;

                        for (let s of segments) {
                            if (!s.name) {
                                result.push({
                                    task_id: task_id,
                                    pri_idx: idx,
                                    type: "error",
                                    action_type: prim.action,
                                    info: "未设置字段名"
                                });
                            } else {
                                let flag = 0;
                                for (let rs of protocol.segments) {
                                    if (s.name == rs.name) {
                                        flag = 1;
                                    }
                                }
                                if (flag == 0) {
                                    result.push({
                                        task_id: task_id,
                                        pri_idx: idx,
                                        type: "error",
                                        action_type: prim.action,
                                        info: `使用了未定义的字段名"${s.name}"`
                                    });
                                }

                            }

                        }
                    }
                }
            }


        }
        idx++;
    }


    return result;
}

module.exports = CheckProtocol;