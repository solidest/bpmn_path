## 概述

动作原语是实现测试模型可执行的最基本要素

---

#### send

在指定通道上发送协议数据

    schannel: 动作执行所在通道（stream类型接口）

    protocol: 发送动作使用的协议

    binding: 协议字段与参数绑定关系

        name: 协议字段名
        bindtype: 绑定类型，send只有value值绑定一种类型
        vbind: 绑定的值

示例数据：

    {
        "$type": "send",
        "protocol": "pr_GPS",
        "binding": [{
            "name": "header",
            "bindtype": "value",
            "vbind": "0x55AA"
        }, {
            "name": "coordinate",
            "bindtype": "value",
            "readonly": true
        }, {
            "name": "coordinate.longitude",
            "bindtype": "value",
            "vbind": "para1"
        }, {
            "name": "coordinate.latitude",
            "bindtype": "value",
            "vbind": "para2"
        }, {
            "name": "verification",
            "bindtype": "value",
            "vbind": "crc(SUM8, longitude, latitude)"
        }, {
            "name": "tail",
            "bindtype": "value",
            "vbind": "0xAA55"
        }],
        "schannel": "ch_GPS"
    }


---

#### recv

在指定通道上接收协议数据

    schannel: 动作执行所在通道（stream类型接口）

    protocol: 发送动作使用的协议
    
    timeout: 超时设置

    binding: 协议字段与参数绑定关系

        name: 协议字段名
        bindtype: 绑定类型：assert.ok执行断言，value执行赋值
        vbind: 绑定的值
        

示例数据：

    {
        "$type": "recv",
        "protocol": "pr_GPS",
        "binding": [{
            "name": "header",
            "bindtype": "assert.ok",
            "vbind": "value==0x55AA"
        }, {
            "name": "coordinate",
            "bindtype": "value",
            "readonly": true
        }, {
            "name": "coordinate.longitude",
            "bindtype": "value",
            "vbind": "para1"
        }, {
            "name": "coordinate.latitude",
            "bindtype": "value",
            "vbind": "para2"
        }, {
            "name": "verification",
            "bindtype": "assert.ok",
            "vbind": "value==crc(SUM8, longitude, latitude)"
        }, {
            "name": "tail",
            "bindtype": "assert.ok",
            "vbind": "value==0xAA55"
        }],
        "timeout": 3000,
        "schannel": "ch_GPS"
    }

---
