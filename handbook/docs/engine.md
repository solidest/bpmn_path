
## 概述
- 执行引擎指ETestLite下位机执行环境
- 采用C/C++ 11开发，跨Windows/Linux平台，无依赖
- 编译输出为单个二进制可执行文件，无外部引用

核心模块组成：

| 模块 | 名称 | 说明 |
|------|------|------|
| [CPT](#cpt) | 通信协议表 | 协议模版管理器，提供协议注册、注销、打包、解包API |
| [CVT](#cvt) | 通信变量表 | 全局变量管理器，实现线程安全机制和事件订阅分发机制 |
| [CIT](#cit) | 通信接口表 | 接口管理器，实现驱动加载、执行数据IO和自动采集 |
| [SRV](#srv) | 网络服务接口 | tcp监听服务，接收执行设计器（上位机）发送的命令 |
| [ENG](#eng) | 执行引擎对象 | 负责创建和清理执行环境的所有核心对象 |
| [SCH](#sch) | 调度器 | 负责用例执行时的异步（线程、协程）调度 |
| [API](#api) | 用户开发API | 供用户开发用例使用的API（开发语言类型无关） |
| [VM](#vm)  | 虚拟机抽象接口 | 定义脚本语言类型无关的虚拟机抽象接口 |
| [LUA](#lua) | LUA脚本绑定 | LUA语言的VM接口实现 |
| [STDB](#stdb) | 时序数据库引擎 | 提供按Key和时间戳存储、查询数据的功能 |
| [RT](#rt)   |  实时任务接口 | 封装了Linux RT的实时任务API |

#### CPT

通信协议表（Communication Protocol Table)，核心API如下：

- NewProtocol 新建协议模版
- DelProtocol 删除协议模版
- PackFrame 打包一帧报文
- UnpackFrame 解包一帧报文

如需粘包解析，使用以下一组API：

- CreateUnpackTask 创建一个解包任务
- FeedRecvBuffer 分步将buffer添加到解包任务中
- ReleaseUnpackTask 释放解包任务

说明：

- CPT可完全独立使用，打包输入和解包输出均为c++ json对象（注意：非json字符串）
- 绑定到特定语言环境时，推荐使用类型映射的方式，避免使用json序列化带来性能损失
- 详细API参数，请查阅 src/CPT.h 文件

#### CVT

通信变量表（Communication Value Table)，核心API如下：

- SetValue：设置变量值
- GetValue：获取变量值
- Sub：订阅变量修改事件
- UnSub：取消订阅

说明：

- CVT的API函数全部是线程安全的
- 详细API参数，请查阅 src/CVT.h 文件

#### CIT

通信接口表（Communication Interface Table)，核心API如下：

- Initial：初始化CIT，加载驱动程序
- RegisterCard：注册一个硬件设备
- RegisterDataInterface：注册一个数据流类型接口
- RegisterDigitalInterface：注册一个数字信号接口
- RegisterAnalogInterface：注册一个模拟信号接口
- RegisterExfun：注册一个驱动自定义API函数

说明：

- 硬件驱动程序采用标准动态库格式，windows下为.dll，linux下为.so
- 驱动程序必须导出 e_initial、e_release两个函数
- 驱动封装请引用头文件 src/drv/drvdef.h
- 自动采集可以选择poll、select、tick三种模式任一种
- 更多API细节，请查阅 src/CIT.h 和 src/drv/InterfaceXXXX.h

#### SRV

网络服务接口（Server API)用来接收外部命令，命令包括：

- ping：正常返回字符串：pong
- state：返回执行引擎当前状态：idle/prepared/running/pause 四种状态之一
- exit：退出整个执行引擎进程
- prepare：准备执行环境
- start：开始执行用例
- stop：停止执行用例
- clear：清除执行环境
- continue：继续处于暂停状态的执行引擎
- pauseInfo：返回暂停时的提示信息
- outDigital：查询数字量接口的输出记录
- outAnalog：查询模拟量接口的输出记录
- outData：查询字节流接口的输出记录
- outProt：查询协议打包输出记录
- inDigital：查询数字量接口的输入记录
- inAnalog：查询模拟量接口的输入记录
- inData：查询字节流接口的输入记录
- inProt：查询协议解包输入记录
- sysOut：查询系统输出记录

SRV支持两种客户端连接：

- telnet客户端：直接使用telnet命令连接SRV，从命令行输入命令
- 使用任一开发语言的[redis客户端](https://redis.io/clients)连接到SRV，发送命令到服务器即可

说明：

- SRV是执行引擎主线程上运行的唯一任务
- SRV默认协议和端口号为 TCP 1210，可替换为UDP或Unix Socket协议
- SRV仅使用了redis传输协议的部分源代码，并不使用redis的任何模块
- 详细API参数，请查阅 src/SRV.h 文件

#### ENG

引擎对象（Engine Object)，实现执行环境对象的创建和清理

- 详细实现，请查阅 src/ENG.h 文件

#### SCH

调度器（scheduling API)，实现执行用例的异步调度

- 基于开源c语言库libuv实现
- 用例执行被放在主事件循环(uv_loop)上
- IO执行全部采用异步模式，以保证主循环无阻塞

- 详细实现，请查阅 src/SCH.h 文件

#### API

- 用户开发API（User SDK)，提供给用户开发用例使用的API
- 仅包含底层实现，未绑定特定脚本语言

- 详细信息，请查阅 src/api 目录


#### VM

- 虚拟机抽象接口（Virtual Machine API），定义脚本语言虚拟机的抽象接口
- 接口定义可以兼容lua、python、.net、javascript四种类型虚拟机

- 详细信息，请查阅 src/VM.h 文件

#### LUA

- 提供lua vm下的VM接口实现
- 提供c++ json class与lua table数据类型之间的映射
- 实现用户API的lua语言绑定
- 修改了lua gc算法，满足1ms实时性要求
- 说明：lua vm已采用静态编译，无需单独安装
- 详细信息，请查阅 src/lua 目录

#### STDB

STDB（Simulation Test Database），仿真测试专用的数据库引擎，主要API：

- set：存储一个带时间戳的二进制安全的字符串数据
- seti：存储一个带时间戳的整数值（模拟信号量）
- setb：存储一个带时间戳的布尔值（数字信号量）
- get：按主键和时间戳查询字节流数据
- geti 同上
- getb 同上
- lget 按主键和开始时间查询数据
- lgetb 同上
- lgeti 同上
- lrange 按主键、开始时间和结束时间查询数据
- lrangei 同上
- lrangeb 同上

说明：

- 建议将接口名称加 _in或_out作为主键
- STDB底层使用level db引擎，存储格式为sst文件
- 可以管理TB级别的数据，单个数据库建议不超过100TB
- API详细参数，请查阅 src/db 目录

#### RT

实时任务接口（Real Time API），核心API如下：

- rt_task 立即启动一个实时任务
- rt_task_timeout 启动一个延时实时任务
- rt_task_interval 启动一个周期性实时任务

- API详细参数，请查阅 src/rt 目录

