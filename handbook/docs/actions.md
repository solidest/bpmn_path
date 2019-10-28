## 概述

动作原语是实现测试模型可执行的最基本要素

---

#### send

在指定通道上发送协议数据

    channel: 动作执行所在通道

    protocol: 发送动作使用的协议

    databinding: 协议字段与参数绑定关系

        xxx: 字段绑定

示例数据：

    `{
        "$type": "send",
        "channel": "channelname",
        "protocol": "protocolname",
        "databinding": {...}
    }`

---

#### recv

在指定通道上接收协议数据

    channel: 动作执行所在通道

    protocol: 发送动作使用的协议

    databinding: 协议字段与参数绑定关系

        xxx: 字段绑定

示例数据：

    `{
        "$type": "send",
        "channel": "channelname",
        "protocol": "protocolname",
        "databinding": {...}
    }`

---