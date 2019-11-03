const createFullPathes = require("./FullPath");

//层级线
class LevelLine {
    constructor(outLine) {
        this.startNode = outLine.from;
        this.startLine = outLine;
        let nodes = [];
        let next = outLine.to;
        while (next) {
            nodes.push(next);
            if (next.outgoing && next.outgoing.length === 1) {
                next = next.outgoing[0];
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
        if (!prev) {
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
        if (!this.endNode.includes(levelLine.endNode)) {
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

    //本层与下一层的路径组合数
    nextOutCount() {
        if (!this.next) {
            return this.levelLines.length;
        } else {
            let ret = 0;
            for (let n of this.endNodes) {
                if (!n.outgoing) {
                    ret += n.incoming.length;
                } else {
                    ret += (n.incoming.length * n.outgoing.length);
                }
            }
            return ret;
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
    let startNode = graph.startNode;
    for (let outLine of startNode.outgoing) {
        let startLevelLine = new LevelLine(startNode, outLine);
        prevLevel.addLevelLine(startLevelLine);
    }
    levels.push(prevLevel);

    while (!prevLevel.isEnd) {
        let nextLevel = new Level(prevLevel);
        for (let line of prevLevel.outgoing) {
            let nextLevelLine = new LevelLine(line.from, line);
            nextLevel.addLevelLine(nextLevelLine);
        }
        levels.push(nextLevel);
        prevLevel = nextLevel;
    }
    return levels;
}

//生成相邻路径组合
function getAdjoinLevels(levels) {
    let res = [];
    let level1 = levels[0];
    let level2 = level1.next;
    while (level2) {

        let count = 0;
        let stopcount = 0;
        for (let n of leve11.endNodes) {
            if (!n.outgoing) {
                stopcount += 1;
            } else {
                count += (n.outgoing.length * n.incoming.length);
            }
        }
        res.push({
            from: leve11,
            to: leve12,
            count: count,
            stopcount: stopcount
        });

        level1 = level2;
        level2 = level2.next;
    }
    return res;
}

//折叠相邻路径
function foldAdjoinLevels(adjoinLevels) {
    let len = adjoinLevels.length;
    if (len < 2) {
        return adjoinLevels;
    }

    let res = [];
    for (let i = 0; i < len - 1; i++) {
        let adjoin1 = adjoinLevels[i];
        let adjoin2 = adjoinLevels[i + 1];
        let count = adjoin1.count * adjoin2.count;
        let stopcount = adjoin1.stopcount + adjoin1.count * adjoin2.stopcount;
        res.push({
            from: adjoin1.from,
            to: adjoin2.to,
            count: count,
            stopcount: stopcount
        });
    }
    return res;
}

//相邻路径中找到最大路径开始层
function getMaxAdjoinLevel(adjonLevels) {
    let max = 0;
    let maxitem = null;
    for (let adj of adjonLevels) {
        if ((adj.count + adj.stopcount) > max) {
            max = adj.count + adj.stopcount;
            maxitem = adj.level1;
        }
    }
    return maxitem;
}

//单层中查找路径最多的一层
function getMaxLevel(levels) {
    let max = 0;
    let maxitem = null;
    for (let l of levels) {
        if (l.levelLines.length > max) {
            max = l.levelLines.length;
            maxitem = l;
        }
    }
    return maxitem;
}

//追加全路径
function appendFullPath(path_results, level) {

    if(path_results.length===0) {
        for(let ps of level.levelLines) {
            let fps = [];
            for(let n of ps.nodes) {
                fps.push(n);
            }
            path_results.push(fps);
        }
        return;
    }

    for (let from of level.startNodes) {
        //按节点找到接头
        let from_ps = [];
        for (let p of path_results) {
            if (p[p.length - 1] === from) {
                from_ps.push(p);
            }
        }

        let len = from.outgoing.length;

        if (len === 1) {
            let next = from.outgoing[0].to;
            while (!next) {
                for (let p of from_ps) {
                    p.push(next);
                }
                if (next.outgoing && next.outgoing.length === 1) {
                    next = next.outgoing[0].to;
                } else {
                    next = null;
                }
            }
        } else if (len > 1) {
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
                let next = from.outgoing[i].to;
                while (!next) {
                    for (let p of pps) {
                        p.push(to);
                    }
                    if (next.outgoing && next.outgoing.length === 1) {
                        next = next.outgoing[0].to;
                    } else {
                        next = null;
                    }
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
}

//线性追加下一层
function appendNextLevel(path_results, level) {
    for(let node of level.startNodes) {

        //找出上接头路径
        let pre_pathes = [];
        for(let ps of path_results) {
            if(ps[ps.length-1]===node) {
                pre_pathes.push(ps);
            }
        }

        //找出下接头路径
        let nex_pathes = [];
        for(let ps of level.levelLines) {
            if(ps[0]===node) {
                nex_pathes.push(ps);
            }
        }

        //线性添加路径
        let len = nex_pathes.length;
        for(let i=0; i<pre_pathes.length; i++) {
            let ns = nex_pathes[i%len];
            for(let n of ns.nodes) {
                if(n!=node) {
                    pre_pathes[i].push(n);             
                }
            }
        }
    }
}

//线性追加上一层
function appendPrevLevel(path_results, level, depth) {

    include_end = false;
    for(let node of level.endNodes) {

        //找出下接头路径
        let nxt_pathes = [];
        for(let ps of path_results) {
            if(ps[0]===node) {
                nxt_pathes.push(ps);
            }
        }
        if(nxt_pathes.length===0) {
            include_end = true;
            continue;
        }

        //找出上接头路径
        let pre_pathes = [];
        for(let ps of level.levelLines) {
            if(ps[ps.length-1]===node) {
                pre_pathes.push(ps);
            }
        }

        //线性添加路径到前面
        let len = nex_pathes.length;
        for(let i=0; i<nex_pathes.length; i++) {
            let ps = pre_pathes[i%len];
            for(let ii=ps.nodes.length-2; i>=0; i--) {
                nex_pathes[i].unshift(ps[ii]);
            }
        }
    }

    if(!include_end) {
        return;
    }

    //添加结束路径的全路径
    if(depth<=1 || !level.prev) {
        for(let l of level.levelLines) {
            if(l.isEnd) {
                path_results.push(l.nodes);
            }
        }
    } else if(depth>1) {
        //先生成前缀路径中的全路径
        let predepth = 0;
        let startPrev = null;
        let prev = level.prev;
        while(prev && depth>1) {
            startPrev = prev;
            predepth++;
            depth--;
            prev = prev.prev;
        }

        let endResult = [];
        let next = startPrev;
        for(let i=0; i<predepth; i++) {
            appendFullPath(endResult, next);
            next = next.next;
        }

        //在前缀前路径中追加结束路径
        for(let l of level.levelLines) {
            if(l.isEnd) {
                //复制出当前结束路径的前缀路径组
                let copys = [];
                for (let p of endResult) {
                    if(p[p.length-1]===l.nodes[0]) {
                        let cp = [];
                        for (let n of p) {
                            cp.push(n);
                        }
                        copys.push(cp);
                    } 
                }

                //在复制结果中添加结束路径
                for(let p of copys) {
                    for(let i=1; i<l.nodes.length; i++) {
                        p.push(l.nodes[i]);
                    }
                }

                //追加到总路径中
                for(let p of copys) {
                    path_results.push(p);
                }
            }
        }
    }
}

//从指定层级开始生成路径
function createPathes(startLevel, depth) {

    let path_results = [];

    //按depth生成正交
    let next_level = startLevel;
    for (let i = 0; i < depth; i++) {
        if (!next_level) {
            return path_results;
        }
        appendFullPath(path_results, next_level);
        next_level = next_level.next;
    }

    //向后追加
    while(next_level) {
        appendNextLevel(path_results, next_level);
        next_level = next_level.next;
    }

    //向前追加
    let prev_level = startLevel.prev;
    while(prev_level) {
        appendPrevLevel(path_results, prev_level);
        prev_level = prev_level.prev;
    }

    return path_results;

}

//创建分层路径 depth：深度
function createLevelPath(graph, depth) {
    if (depth <= 0) {
        return createFullPathes(graph);
    }

    //先分出层次来
    let levels = extractLevels(graph);
    if (depth >= levels.length || levels.length < 2) {
        return createFullPathes(graph);
    }

    //线性独立路径
    if (depth === 1) {
        let startLevel = getMaxLevel(levels);
        return createPathes(startLevel, 1);
    }

    //得到相邻组合路径
    let adjonLevels = getAdjoinLevels(levels);
    if (depth === 2) {
        let startLevel = getMaxAdjoinLevel(adjonLevels);
        return createPathes(startLevel, 2);
    }

    //相邻路径正交方式折叠
    for (let i = 2; i < depth; i++) {
        adjonLevels = foldAdjoinLevels(adjonLevels);
    }
    let startLevel = getMaxAdjoinLevel(adjonLevels);
    return createPathes(startLevel, depth);

}

module.exports = createLevelPath;