

//检查动作原语对协议的引用是否正确 cpt是全部协议名称的数组
//这里暂时只对协议名称继续检查
function CheckProtocol(task_id, prim_array, cpt) {
    if (!prim_array || prim_array.length === 0) {
        return result;
    }

    var result = [];
    let idx = 0;
    for (let prim of prim_array) {
        switch (prim.action) {
            case "send":
            case "recv":
                if(!cpt.includes(prim.setting.protocol)) {
                    result.push({
                        task_id: task_id,
                        pri_idx: idx,
                        type: "error",
                        action_type: prim.action,
                        info: `使用了未定义的协议"${prim.setting.protocol}"`
                    });
                }
                break;
        
            default:
                break;
        }
        idx++;
    }
    return result;
}

module.exports = CheckProtocol;