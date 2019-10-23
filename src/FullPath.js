

//追加一个路径节点
function appendNode(path_results, from, outs) {
    let from_ps = [];
    for (let p of path_results) {
        if (p[p.length - 1] === from) {
            from_ps.push(p);
        }
    }

    let len = outs.length;
    if (len === 1) { //单路径直接添加上去
        let to = outs[0].to;
        for (let p of from_ps) {
            p.push(to);
        }
    } else if (len > 1) { //多条路径 先复制 再添加
        //复制和路径数相等的份数
        let copys = [from_ps];
        for (let i = 0; i < len - 1; i++) {
            let pps = [];
            for (let p of from_ps) {
                let cp = [];
                for (let n of p) {
                    cp.push(n);
                }
                pps.push(cp);
            }
            copys.push(pps);
        }

        //逐个路径组追加
        for (let i = 0; i < len; i++) {
            let pps = copys[i];
            let to = outs[i].to;
            for (let p of pps) {
                p.push(to);
            }
        }

        //添加到总路径上去
        for (let i = 1; i < len; i++) {
            let pps = copys[i];
            for (let p of pps) {
                path_results.push(p);
            }
        }

    }
}

//创建全组合路径
function createFullPath(graph) {

    let path_results = [
        [graph.start_node]
    ];

    let nexts = [graph.start_node];
    while (nexts.length > 0) {
        let new_nexts = [];
        for (let from of nexts) {
            let outs = from.outgoing;
            if (outs) {
                appendNode(path_results, from, outs);
                for (let line of outs) {
                    if (line.to && !new_nexts.includes(line.to)) {
                        new_nexts.push(line.to);
                    }
                }
            }
        }
        nexts = new_nexts;
    }
    return path_results;
}


module.exports = createFullPath;