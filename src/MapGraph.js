const BpmnModdle = require('bpmn-moddle');
const customProperty = require("./object_property_ext.json");
const createFullPathes = require("./FullPath");
const createLevelPathes = require("./LevelPath");


//线
class MapLine {
    constructor(id, name, map) {
        this.id = id;
        this.name = name;
        this.map = map;
    }

    //初始化 from to 引用
    initial(source, target) {
        if (source) {
            this.from = this.map.nodes[source.id];
        } else {
            this.from = null;
        }
        if (target) {
            this.to = this.map.nodes[target.id];
        } else {
            this.to = null;
        }
    }
}

//节点
class MapNode {
    constructor(id, name, map, type) {
        this.id = id;
        this.map = map;
        this._name = name;
        this.type = type;
    }

    get name() {
        if(this._name) {
            return this._name;
        }
        return '';
    }

    toString() {
        return this.name;
    }

    //初始化进入、出口路径数组
    initial(incoming, outgoing) {

        if (incoming) {
            this.incoming = [];
            for (let i of incoming) {
                this.incoming.push(this.map.lines[i.id]);
            }
        } else {
            this.incoming = null;
        }

        if (outgoing) {
            this.outgoing = [];
            for (let i of outgoing) {
                this.outgoing.push(this.map.lines[i.id]);
            }
        } else {
            this.outgoing = null;
        }
    }

    hasIncoming() {
        return this.incoming && this.incoming.length > 0;
    }

    hasOutgging() {
        return this.outgoing && this.outgoing.length > 0;
    }
}

//模型图类定义
class MapGraph {
    constructor(path_depth) {
        this.path_depth = path_depth && path_depth>0 ? path_depth : 0;
    }

    //是否检执行过模型查过？
    get isCheck() {
        return this.check_results;
    }

    //模型是否有错误？
    get isError() {
        if (!this.isCheck) {
            this.check();
        }
        for (let r of this.check_results) {
            if (r.result === 'error') {
                return true;
            }
        }
        return false;
    }

    //生成路径
    createPathes() {
        if (this.path_results) {
            return this.path_results;
        }

        if (this.isError) {
            return null;
        }

        this.path_results = createLevelPathes(this, this.path_depth);
        return this.path_results;
    }


    //检查模型设计
    check() {
        if (this.check_results) {
            return this.check_results;
        }
        this.check_results = [];

        //起点检查
        if (!this.start_node) {
            this.pushResult('error', '缺少<开始>节点')
        } else {
            for (let n in this.nodes) {
                let e = this.nodes[n];
                if (e.type === 'bpmn:StartEvent' && e !== this.start_node) {
                    let msg = '【' + (e.name ? e.name : '') + '】多起点';
                    this.pushResult('error', msg, e.id);
                }
            }
        }

        //孤岛检查
        for (let n in this.nodes) {
            let e = this.nodes[n];
            let hasi = e.hasIncoming();
            let haso = e.hasOutgging();
            if (!hasi && (!haso || e.type !== 'bpmn:StartEvent')) {

                let msg = '【' + (e.name ? e.name : '') + '】不可达';
                this.pushResult('warning', msg, e.id);
            }
            if (hasi && !haso && e.type !== 'bpmn:EndEvent') {
                let msg = '【' + (e.name ? e.name : '') + '】未结束';
                this.pushResult('warning', msg, e.id);
            }
        }

        //环路检查
        this.checkCircle();

        //总结
        if (this.check_results.length === 0) {
            this.pushResult('info', '检查通过', null, null, 'ok');
        }
        // console.log(this.check_results);
        return this.check_results;
    }

    //检查是否有环
    checkCircle() {
        let touched = {};
        let recursionStack = {};

        for(let id in this.nodes) {
            let cn = this.checkNodeCircle(this.nodes[id], touched, recursionStack);
            if(cn) {
                let msg = '【' + cn.name + '】存在环路';
                this.pushResult('error', msg, cn.id);
                return true;
            }
        }
        return false;
    }

    checkNodeCircle(node, touched, recursionStack) {
        if(!touched[node.id]) {
            touched[node.id] = true;
            recursionStack[node.id] = true;

            if(node.outgoing) {
                for(let line of node.outgoing) {
                    if(!touched[line.to.id]) {
                        let nn = this.checkNodeCircle(line.to, touched, recursionStack);
                        if(nn) {
                            return nn;
                        } else if(recursionStack[line.to.id]) {
                            return line.to;
                        }
                    } else if(recursionStack[line.to.id]) {
                        return line.to;
                    }
                }
            }
        }
        recursionStack[node.id] = false;
        return null;
    }

    //添加检查结果
    pushResult(result_type, msg, element_id, idx, tag) {
        let result = {
            result: result_type,
            msg: msg
        };
        if (element_id) {
            result.element_id = element_id;
        }
        if (idx) {
            result.idx = idx;
        }
        if (tag) {
            result.tag = tag;
        }
        this.check_results.push(result);
    }

    //初始化模型
    _initial(ctx) {
        let self = this;
        self.nodes = {}; //for graph
        self.lines = {}; //for graph
        self.start_node = null;

        if (ctx.rootElements && ctx.rootElements.length === 1 && ctx.rootElements[0]['$type'] === 'bpmn:Process') {
            let elements = ctx.rootElements[0].flowElements;
            if (!elements) {
                return;
            }
            //create element
            for (let e of elements) {
                let new_e = null;
                let type = e['$type'];
                switch (type) {
                    case 'bpmn:StartEvent':
                        new_e = new MapNode(e.id, e.name, self, type);
                        self.start_node = new_e;
                        self.nodes[e.id] = new_e;
                        break;
                    case 'bpmn:SubProcess':
                    case 'bpmn:EndEvent':
                    case 'bpmn:ScriptTask':
                    case 'bpmn:BusinessRuleTask':
                    case 'bpmn:ManualTask':
                    case 'bpmn:ExclusiveGateway':
                    case 'bpmn:ParallelGateway':
                    case 'bpmn:Task':
                        new_e = new MapNode(e.id, e.name, self, type);
                        self.nodes[e.id] = new_e;
                        break;
                    case 'bpmn:SequenceFlow':
                        new_e = new MapLine(e.id, e.name, self);
                        self.lines[e.id] = new_e;
                        break;
                    default:
                        throw 'error element type:' + type;
                }
            }

            //link element
            for (let e of elements) {
                let type = e['$type'];
                switch (type) {
                    case 'bpmn:StartEvent':
                    case 'bpmn:SubProcess':
                    case 'bpmn:EndEvent':
                    case 'bpmn:ScriptTask':
                    case 'bpmn:BusinessRuleTask':
                    case 'bpmn:ManualTask':
                    case 'bpmn:ExclusiveGateway':
                    case 'bpmn:ParallelGateway':
                    case 'bpmn:Task':
                        self.nodes[e.id].initial(e.incoming, e.outgoing);
                        break;
                    case 'bpmn:SequenceFlow':
                        self.lines[e.id].initial(e.sourceRef, e.targetRef);
                        break;
                    default:
                        throw 'error element type:' + type;
                }
            }
        }
    }


}


//从xml加载
async function create(path_depth, map_xml) {
    let options = {
        tcg: customProperty
    };
    let moddle = new BpmnModdle(options);
    let res = await new Promise((resolve, reject) => {
        moddle.fromXML(map_xml, function (err, ctx) {
            if (err) {
                reject(err);
            } else {
                let ret = new MapGraph(path_depth);
                ret._initial(ctx);
                resolve(ret);
            }
        });
    });
    return res;
}

module.exports = create;