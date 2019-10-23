

//创建分层路径 depth：深度
function createLevelPath(graph, depth) {
    let path_results = [
        [graph.start_node]
    ];
    if(depth<1) {
        return path_results;
    }

    console.log("待完成...");
    
    return path_results;
}

module.exports = createLevelPath;