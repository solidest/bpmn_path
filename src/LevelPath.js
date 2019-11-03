const createFullPathes = require("./FullPath");
const assert = require("assert");

//层级线
class LevelLine {
    constructor(outLine) {
        this.startNode = outLine.from;
        let nodes = [];
        let next = outLine.to;
        while (next) {
            nodes.push(next);
            if (next.outgoing && next.outgoing.length === 1) {
                next = next.outgoing[0].to;
            } else {
                next = null;
            }
        }
        this.nodes = nodes;
        this.endNode = nodes[nodes.length - 1];
    }

    get isEnd() {
        return !this.endNode.outgoing || this.endNode.outgoing.length === 0;
    }
}

//层级
class Level {
    constructor(prev) {
        this.prev = prev;
        if (prev) {
            prev.next = this;
        }
        this.levelLines = [];
        this.startNodes = [];
        this.endNodes = [];
        this.outgoing = [];
    }

    //添加层级线
    addLevelLine(levelLine) {
        this.levelLines.push(levelLine);
        if (!this.startNodes.includes(levelLine.startNode)) {
            this.startNodes.push(levelLine.startNode);
        }
        if (!this.endNodes.includes(levelLine.endNode)) {
            this.endNodes.push(levelLine.endNode);
        }
        if (!levelLine.isEnd) {
            for (let outLine of levelLine.endNode.outgoing) {
                if (!this.outgoing.includes(outLine)) {
                    this.outgoing.push(outLine);
                }
            }
        }
    }

    get isEnd() {
        return this.outgoing.length === 0;
    }
}

//抽取出所有层级
function extractLevels(graph) {
    let levels = [];
    let prevLevel = new Level(null);

    //处理开始节点
    let startNode = graph.start_node;
    for (let outLine of startNode.outgoing) {
        let startLevelLine = new LevelLine(outLine);
        prevLevel.addLevelLine(startLevelLine);
    }
    levels.push(prevLevel);

    while (!prevLevel.isEnd) {
        let nextLevel = new Level(prevLevel);
        for (let line of prevLevel.outgoing) {
            let nextLevelLine = new LevelLine(line);
            nextLevel.addLevelLine(nextLevelLine);
        }
        levels.push(nextLevel);
        prevLevel = nextLevel;
    }
    return levels;
}

//创建指定层级的全路径
function getFullPathes(startLevel, depth) {
    let res = [];

    //第一个层级
    for(let levelp of startLevel.levelLines) {
        res.push([levelp]);
    }

    //后续层级
    let nextLevel = startLevel.next;
    while(--depth>0 && nextLevel) {

        for(let n of nextLevel.startNodes) {
            //找到本次循环节点上的全部下级路径
            let outCount = n.outgoing.length;
            let outLevelLines = [];
            for(let outLine of nextLevel.levelLines) {
                if(outLine.startNode===n) {
                    outLevelLines.push(outLine);
                }
            }
            assert.ok(outCount===outLevelLines.length);


            //按上一级的结尾找出路径
            let finded = [];
            for(let p of res) {
                if(p[p.length-1].endNode===n) {
                    finded.push(p);
                }
            }

            //复制和路径数相等的份数
            let copys = [finded];
            for (let i = 0; i < outCount - 1; i++) {
                let pps = [];
                for (let p of finded) {
                    let cp = [];
                    for (let n of p) {
                        cp.push(n);
                    }
                    pps.push(cp);
                }
                copys.push(pps);
            }

             //逐个路径组追加
            for (let i = 0; i < outCount; i++) {
                let pps = copys[i];
                let levelLine = outLevelLines[i];
                for (let p of pps) {
                    p.push(levelLine);
                }
            }

            //追加回总路径上去
            for (let i = 1; i < outCount; i++) {
                let pps = copys[i];
                for (let p of pps) {
                    res.push(p);
                }
            }

            nextLevel = nextLevel.next;
        }
    }
    return res;
}


//路径追加合并
function appendLevelLines(adjoinNodes, prev_results, next_levels, is_last) {
    //第一次直接复制
    if(prev_results.length===0) {
        if(is_last) {
            for(let p of next_levels) {
                prev_results.push(p);
            }
        } else {
            for(let p of next_levels) {
                prev_results.push([p[0]]);
            }
        }
        return;
    }

    for(let adjoinNode of adjoinNodes) {
        let prev_finded = [];
        let next_finded = [];

        //找到前一级的本轮节点路径
        for(let p of prev_results) {
            if(p[p.length-1].endNode === adjoinNode) {
                prev_finded.push(p);
            }
        }

        //找到下一级的本轮节点路径
        for(let p of next_levels) {
            if(p[0].startNode === adjoinNode) {
                next_finded.push(p);
            }
        }

        //如果前一级的连接点少于下一级的连接点就线性添加足够的数量
        let prev_count = prev_finded.length;
        let next_count = next_finded.length;

        if(prev_count<next_count) {
            let diff = next_count-prev_count;
            for(let idx=0; idx<diff; idx++) {
                let cpyfrom = prev_finded[idx%prev_count];
                let cpyto = [];
                for(let l of cpyfrom) {
                    cpyto.push(l);
                }
                prev_finded.push(cpyto);
                prev_results.push(cpyto);
            }
            prev_count += diff;
        }

        //前后连接
        for(let idx=0; idx<prev_count; idx++) {
            let prev = prev_finded[idx];
            let next = next_finded[idx%next_count];
            if(is_last) {
                for(let l of next) {
                    prev.push(l);
                }
            } else {
                prev.push(next[0]);
            }
        }
    }
}


//创建分层路径 depth：深度
function createLevelPath(graph, depth) {
    if (!depth || depth <= 0) {
        return createFullPathes(graph);
    }

    //先分出层次来
    let levels = extractLevels(graph);
    let levelCount = levels.length;
    if (depth >= levelCount || levelCount < 2) {
        return createFullPathes(graph);
    }

    //逐个level按照depth生成全路径，然后添加到总路径上
    let levelPathes = [];
    for(let ilevel=0; ilevel<levelCount-depth+1; ilevel++) {
        let subFullPathes = getFullPathes(levels[ilevel], depth);
        appendLevelLines(levels[ilevel].startNodes, levelPathes, subFullPathes, ilevel===levelCount-depth);
    }

    //分层路径转换成节点路径
    let nodePathes = [];
    for(let lls of levelPathes) {
        let np = [lls[0].startNode];
        for(let ll of lls) {
            for(let n of ll.nodes) {
                np.push(n);
            }
        }
        nodePathes.push(np);
    }

    return nodePathes;
}

module.exports = createLevelPath;