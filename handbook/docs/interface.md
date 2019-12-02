
## 概述
接口配置用于描述[目标设备](#_2)接口与[工具设备](#_3)接口之间的连接参数

示例数据：

    {
        "name": "demo1",
        "tool": {
            "machine": "xxx.xxx.xxx.xxx",
            "device": "virtual device",
            "idx": "0",
            "interface": "com1"
        },
        "target": {
            "type": "di"
        }
    }

#### 通道名称
- 用户自定义的接口名称
- name：字符串

#### 工具设备 tool
- 工具设备指测试/仿真工具硬件，也就是运行ETest的硬件设备
- tool：字典对象，设备参数配置

#### 目标设备
- 目标设备指ETest中执行输入输出时的目标对象设备，在测试业务中即为被测设备
- target：对象字典，设备参数配置
