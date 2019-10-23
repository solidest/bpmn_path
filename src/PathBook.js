
//生成可读路书
function createPathBook(path) {
    if (!path) {
        return '';
    }
    let from = null;
    let book = [];
    for (let idx = 0; idx < path.length; idx++) {

        let node = path[idx];
        let n = node.name;
        if (!n) {
            switch (node.type) {
                case 'bpmn:Task':
                case 'bpmn:SubProcess':
                case 'bpmn:ScriptTask':
                case 'bpmn:SequenceFlow':
                case 'bpmn:BusinessRuleTask':
                    n = '?';
                    break;
                case 'bpmn:StartEvent':
                    n = '开始';
                    break;
                case 'bpmn:EndEvent':
                    n = '结束';
                    break;
            }
        }

        if (!n) {
            from = node;
            continue;
        }

        if (from) {
            let lb = '→';
            for (let line of node.incoming) {
                if (line.from === from) {
                    if (line.name) {
                        lb = '(' + line.name + ')→';
                    }
                    break;
                }
            }
            book.push(lb + n);
        } else {
            book.push(n);
        }

        from = node;

    }
    return book.join('');
}

module.exports = createPathBook;