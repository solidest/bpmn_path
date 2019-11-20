## 概述
> ETestLite使用Lua做为开发用例的脚本语言，除[标准库](#_2)里的全局函数外，执行引擎还内置有[engine](#engine)、[event](#event)、[assert](#assert)、[task](#task)、[math](#math)、[string](#string)、[table](#table)等API库

---
### 基础库

#### cit 
    通信接口表（communication interface table），执行引擎中已经添加的全部接口表

#### cpt 
    通信协议表（communication protocol table），执行引擎中已经添加的全部协议表

#### cvt
    现时变量表（current value talbe），执行引擎中已添加的全部现时变量表

#### cvtNew ( name )
    添加一个现时变量

#### cvtDel ( name )
    删除一个现时变量

#### cvtSet ( name, value )
    设置现时变量的值

#### cvtGet ( name )
    获取现时变量的值

#### pack ( protocol, data_table )
    按照指定协议打包数据表，返回 string_buffer

#### unpack ( protocol, buffer_string )
    按照指定协议解包二进制缓存，返回 data_table

#### send ( interface, protocol, data_table )
    在指定接口上按照协议发送表数据

#### recv ( interface, protocol, timeout )
    在指定接口上按照协议接收数据，返回接收结果，超时返回nil

#### sendBuffer ( interface, protocol, string_data )
    在指定接口上发送二进制数据

#### recvBuffer ( interface, protocol, timeout )
    在指定接口接上收二进制数据，返回string类型的数据，超时返回nil

#### read ( interface )
    在数字/模拟接口上读取一个值

#### write ( interface, value )
    在数字/模拟接口上写入一个值

#### delay ( millise )
    延时指定的毫秒数

#### startSend ( interface, protocol, interval_time,  data_generator )
    启动循环发送

#### stopSend ( interface )
    停止循环发送

#### startRecv ( interface, protocol, afterRecvCallback )
    启动持续接收

#### stopRecv ( interface )
    停止持续接收

#### startTone ( interface, frequency, duration )
    在指定接口上发送指定频率（50％占空比）的方波，并持续指定时间长度

#### stopTone ( interface )
    停止指定接口上的方波发送

#### pulseIn ( interface, is_high, timeout )
    测量指定接口上的脉冲长度

#### shiftIn（ interface, time_series, bitOrder )
    按时钟顺序指示，逐位移入指定接口上的电平信号值

#### shiftOut （ interface, time_series, bitOrder, buffer, bitLen ）
    按时钟顺序指示，将buffer值逐位移出到指定接口

#### call（ interface, ext_fun_name, argv_table )
    在指定接口上调用一个扩展函数

---
### engine库
    对用例执行引擎环境进行操作的API

#### engine.cptNew ( name, dpd_json )
    在执行引擎上添加一个dpd协议

#### engine.cptDel ( name )
    在执行引擎上移除一个dpd协议
    
#### engine.citNew ( name, config_json )
    在执行引擎上添加一个接口定义

#### engine.citDel ( name )
    在执行引擎上移除一个接口定义

#### engine.runScript ( case_script )
    在执行引擎上运行指定的脚本内容

#### engine.runFile ( file_name )
    在执行引擎上运行指定的脚本文件

#### engine.runRTScript ( case_script )
    以实时模式，在执行引擎上运行指定的脚本文件

#### engine.runRTFile ( file_name )
    以实时模式，在执行引擎上运行指定的脚本文件

#### engine.pause ()
    暂停引擎执行

#### engine.continue ()
    继续引擎执行

---

### event库

#### event.onSended ( interface, callback )
    在指定接口上发送数据完成后执行回调
#### event.onRecved ( interface, callback )
    在指定接口上接收数据完成后执行回调
#### event.onProtocolSended ( interface, protocol, callback )
    在指定接口上发送协议完成后执行回调
#### event.onProtocolRecved ( interface, protocol, callback )
    在指定接口上接收协议完成后执行回调
#### event.onDigitalChanged ( interface, callback )
    在指定dio接口上电平值发生改变后执行回调
#### event.onCvtChanged ( name, callback )
    指定的现时变量发生变化时执行回调
#### event.pub ( softbus_name, value )
    在软总线上发布数据
#### event.sub ( sofbus_name, callback )
    订阅软总线上的数据

---
### assert库
执行断言测试的api库，说明：Lua原生的assert函数不再可用

#### assert.ok ( expression, tip )
    断言表达式为真，失败后提示tip信息
#### assert.changeHigh ( interface, timeout, tip )
    断言指定时间内，指定接口电平值由低变高
#### assert.changeLow ( interface, timeout, tip )
    断言指定时间内，指定接口电平值由高变低
#### assert.protocolOk ( protocol, data_table )
    断言指定的数据表是有效的协议包

---
### task库
实现多线程任务的库，线程中创建的任务与主线程共享cvt、cit、cpt，但不共享lua全局变量

#### task.newTask ( task_callback, then_callback, ... )
    创建一个独立线程任务，并立即执行，输入可变参数，任务结束后在当前线程执行then回调

#### task.newRTTask ( task_priority, task_callback, then_callback, ... )
    创建一个指定优先级的实时任务，并立即执行，输入可变参数，任务结束后在当前线程执行then回调

---

### math库
数学函数库，[详见Lua文档](http://www.lua.org/manual/5.3/)
#### math.abs
#### math.acos
#### math.asin
#### math.atan
#### math.ceil
#### math.cos
#### math.deg
#### math.exp
#### math.floor
#### math.fmod
#### math.huge
#### math.log
#### math.max
#### math.maxinteger
#### math.min
#### math.mininteger
#### math.modf
#### math.pi
#### math.rad
#### math.random
#### math.randomseed
#### math.sin
#### math.sqrt
#### math.tan
#### math.tointeger
#### math.type
#### math.ult

---

### string库
字符串操作库，[详见Lua文档](http://www.lua.org/manual/5.3/)

#### string.byte
#### string.char
#### string.dump
#### string.find
#### string.format
#### string.gmatch
#### string.gsub
#### string.len
#### string.lower
#### string.match
#### string.pack
#### string.packsize
#### string.rep
#### string.reverse
#### string.sub
#### string.unpack
#### string.upper

---

### table库
表数据操作库，[详见Lua文档](http://www.lua.org/manual/5.3/)
#### table.concat
#### table.insert
#### table.move
#### table.pack
#### table.remove
#### table.sort
#### table.unpack



