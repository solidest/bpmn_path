
//层级线
class LevelLine {
    constructor(startNode, outLine) {
        this.startNode = startNode;
        let nodes = [startNode];
        let next = outLine.to;
        while(next) {
            nodes.push(next);
            if(next.outgoing && next.outgoing.length===1) {
                next = next.outgoing[0];
            } else {
                next = null;
            }
        }
        this.nodes = nodes;
        this.endNode = nodes[nodes.length-1];
    }

    get isEnd() {
        return !this.endNode.outgoing || this.endNode.outgoing.length===0;
    }
}

//层级
class Level {
    constructor(prev) {
        this.prev = prev;
        if(!prev) {
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
        if(!this.startNodes.includes(levelLine.startNode)) {
            this.startNodes.push(levelLine.startNode);
        }
        if(!this.endNode.includes(levelLine.endNode)) {
            this.endNodes.push(levelLine.endNode);
        }
        if(!levelLine.isEnd) {
            for(let outLine of levelLine.endNode.outgoing) {
                if(!this.outgoing.includes(outLine)) {
                    this.outgoing.push(outLine);
                }
            }        
        }

    
    }

    //本层与下一层的路径组合数
    nextOutCount() {
        if(!this.next) {
            return this.levelLines.length;
        } else {
            let ret = 0;
            for(let n of this.endNodes) {
                if(!n.outgoing) {
                    ret += n.incoming.length;
                } else {
                    ret += (n.incoming.length * n.outgoing.length);
                }
            }
            return ret;
        }
    }

    get isEnd() {
        return this.outgoing.length===0;
    }
}

//抽取出所有层级
function extractLevels(graph) {
    let levels = [];
    let prevLevel = new Level(null);
   
    //处理开始节点
    let startNode = graph.startNode;
    for(let outLine of startNode.outgoing) {
        let startLevelLine = new LevelLine(startNode, outLine);
        prevLevel.addLevelLine(startLevelLine);
    }
    levels.push(prevLevel);

    while(!prevLevel.isEnd) {
        let nextLevel = new Level(prevLevel);
        for(let line of prevLevel.outgoing) {
            let nextLevelLine = new LevelLine(line.from, line);
            nextLevel.addLevelLine(nextLevelLine);
        }
        levels.push(nextLevel);
        prevLevel = nextLevel;
    }
    return levels;
}


//根据层级找到最大的路径组合数
function getMaxPathCount(levels, depth) {
    let fullDepth = levels.length;
    if(depth<=0 || depth>fullDepth) {
        depth = fullDepth;
    }

    let max = -1;
    let maxStartLevel = null;

    for(let iLevel=0; iLevel<fullDepth; iLevel++) {
        let counts = [];

        for(let i=0; i<depth-1; i++) {
            if(iLevel+i>=fullDepth) {
                break;
            } else {
                
            }
        }
    }
}

//创建分层路径 depth：深度
function createLevelPath(graph, depth) {
    let path_results = [
        [graph.start_node]
    ];
    if (depth < 1) {
        return path_results;
    }

    //先分出层次来
    let levels = extractLevels(graph);

    //再找到最大公约数
    let maxPathCount = getMaxPathCount(levels, depth);

    return path_results;
}

module.exports = createLevelPath;