## 概述

路径文件是AutoTCG从模型自动生成用例的输出文件，使用json格式

---

#### 示例数据

    {
    "pathes": [
        ["StartEvent_0agjamv", "Task_1yuwf7l", "Start_ZbSXG4Bm", "Task_11moj6f", "Task_0c4ngpw", "Task_0r43ltt", "EndEvent_0bz9hb9"],
        ["StartEvent_0agjamv", "Task_1yuwf7l", "Task_1hrmspd", "Task_1pdgdxt", "Start_ZbSXG4Bm", "Task_11moj6f", "Task_0c4ngpw", "Task_0r43ltt", "EndEvent_0bz9hb9"]
        ],
    "wise": [
        [{
            "arg_a": 298,
            "b": 3.7,
            "d": "b",
            "c": "a"
        }, {
            "arg_a": 300,
            "b": 3.7,
            "d": "b",
            "c": "a"
        }],
        [{
            "arg_a": 298,
            "f": 100,
            "d": "b",
            "c": "a"
        }]
    ],
    "actions": {
        "Task_0o89e8s": [{},{}],
        "Task_987e2df": [{},{}]
    },
    "scripts": {
        "Task_0gkk31u": "--输入脚本\nfunction abc()\n    print(\"hello!\")\nend",
        "Task_76y6sf3": "--输入脚本\nfunction abc()\n    print(\"hello!\")\nend"
    }
}


---

#### 说明
- pathes： 二位数组，路径节点id组成的可执行路径
- wise：二位数组，执行路径对应的输入参数组合
- actions：对象字典，以节点id为主键，键值是动作序列数组
- scripts：对象字典，以节点id为主键，键值是脚本内容


---
