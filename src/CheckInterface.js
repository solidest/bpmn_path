//检查动作原语对接口的使用是否存在错误
//cit_v 是值类型接口的名称数组
//cit_s 是数据流类型接口的名称数组
function CheckProtocol(task_id, prim_array, cit_v, cit_s) {
    let result = [];
    if (!prim_array || prim_array.length === 0) {
        return result;
    }

    let idx = 0;
    for (let prim of prim_array) {
        if (prim.setting) {
            info = prim.setting;
            if (info.schannel) {
                if (!cit_s.includes(info.schannel)) {
                    result.push({
                        task_id: task_id,
                        pri_idx: idx,
                        type: "Interface_error",
                        action_type: prim.action,
                        info: `使用了未定义的stream类型通道"${info.schannel}"`
                    });
                }
            }
            if (info.vchannel) {
                if (!cit_v.includes(info.vchannel)) {
                    result.push({
                        task_id: task_id,
                        pri_idx: idx,
                        type: "Interface_error",
                        action_type: prim.action,
                        info: `使用了未定义的value类型通道"${info.vchannel}"`
                    });
                }
            }

        }
    }

    idx++;

    return result;
}

module.exports = CheckProtocol;