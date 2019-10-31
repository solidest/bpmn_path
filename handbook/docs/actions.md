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

    schannel: 接收数据的通道（stream类型接口）
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

#### read

在数字接口或模拟接口上读取一个值

      vchannel: 要读取的通道(value类型的接口)
      para: 绑定参数

示例数据：

	{
		"$type": "read",
		"vchannel": "ch_dio",
		"para": "para2"
	}

---

#### write

将指定的参数值写入指定的通道(value的接口)

    vchannel: 要写入的通道
    para: 要写入的参数

示例数据：

	{
		"$type": "write",
		"vchannel": "ch_analogy",
		"para": "para3"
	}

---

#### delay

延时指定的毫秒数

     manual_continue: 手动继续，true表示暂停执行，等待人工确认后再继续
     timeout: 延迟继续（ms)，代表延时的时间
	 
示例数据：

	{
	        "$type": "delay",
	        "manual_continue": false,
	        "timeout": 999
	}
	
---	
#### print

依次打印输出传入的参数

    info: 要打印的的输出信息
        

示例数据：


	{
		"$type": "print",
		"info": "\"arg1的值是：\", arg1"
	}
	
---

#### reset

重置指定的通道，清空输入输出缓冲区

    schannel: 动作执行所在通道（stream类型接口）
        

示例数据：

	{
		"$type": "reset",
		"schannel": "ch_GPS"
	}

---
#### assert

执行断言

	expression: 断言的表达式
	assert_type: 断言的类型，一下三种取值之一
		assert.ok: 断言expression表达式计算结果为真
		assert.changeHigh: 断言vchannel接口电平值由低变高
		assert.changeLow: 断言vchannel接口电平值由高变低
	vchannel: 设置通道名称
	timeout: 超时设置

示例数据：

	{
		"$type": "assert",
		"expression": null,
		"assert_type": "changeHigh",
		"vchannel": "ch_dio",
		"timeout": 3000
	}

---
#### call

函数调用

    fun: 被调用的函数名
    argv: 调用函数传入的参数
   

示例数据：

	{
		"$type": "call",
		"fun": "function_name",
		"argv": "para1, para2"
	}

---
