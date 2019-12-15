## 概述

协议配置是用于数据报文组包和解包的模板，采用json格式

协议包括两部分

`protocolName` - 用户定义的协议名称

`segments` - 用户在协议中定义的字段

字段一共有10种类型：
    
    string、integer、float、double、group、integer[]、float[]、double[]、group[]、oneof

字段属性 default、arrayLen 可以使用表达式或函数，比如：

    default = CheckCode(crc.sum8, seg1, seg2)
    arrayLen = ByteLen(sega)/8

---

#### string

字符串类型的数据，说明：字符串类型是二进制安全的

    "seg_type": 字段的数据类型（string）
	"name": 用户定义的字段名称
	"order": 字段的字节存储顺序（大端字节序bigorder或者小端字节序smallorder）
	"type": 字段的解析方式（fixedlen、fixedtail、custom）
	"default": 字段的默认值
    "tail": 字符串结尾标识
    "len": 字符串固定长度
    "pack": 自定义打包函数
    "unpack": 自定义解包函数

#### interger

整数类型的数据

	"seg_type": 字段的数据类型（integer）
	"name": 用户定义的字段名称
    "signed": 是否是有符号整数（true或者false）
	"bitcount": 字段的比特位数（1~64位）
	"order": 字段的字节存储顺序（大端字节序bigorder或者小端字节序smallorder）
	"encode": 字段的编码方式（primitive、inversion或者complement）
	"default": 字段的默认值


示例数据：

    "seg_type": "integer",
    "name": "包头",
    "signed": false,
    "bitcount": 16,
    "order": "smallorder",
    "encode": "primitive",
    "default":
    {
        "$type": "ExpNumber",
        "constNum": 21930
    }

#### float

32位浮点数

    "seg_type": 字段的数据类型（float）
    "name": 用户定义的字段名称
    "order": 字段的字节存储顺序（大端字节序bigorder或者小端字节序smallorder）
    "encode": 字段的编码方式（primitive、inversion或者complement）
    "default": 字段的默认值


示例数据：

    "seg_type": "float",
    "name": "经度信息",
    "order": "smallorder",
    "encode": "primitive",
    "default":
    {
        "$type": "ExpNumber",
        "constNum": 0
    }

#### double

64位浮点数

    "seg_type": 字段的数据类型（double）
    "name": 用户定义的字段名称
    "order": 字段的字节存储顺序（大端字节序bigorder或者小端字节序smallorder）
    "encode": 字段的编码方式（primitive、inversion或者complement）
    "default": 字段的默认值


示例数据：

    "seg_type": "double",
    "name": "纬度信息",
    "order": "smallorder",
    "encode": "primitive",
    "default":
    {
        "$type": "ExpNumber",
        "constNum": 0
    }

#### group

协议段分组，表示一组协议字段

    "seg_type": 字段的数据类型（group）
    "name": 用户定义的字段名称
    "segments": 协议分组中的协议字段

示例数据：

    {
        "seg_type": "group",
        "name": "a",
        "segments": [
        {
            "seg_type": "integer",
            "name": "ccc",
            "signed": true,
            "encode": "complement"
        }]
    }

#### integer[]

整数数组

    "seg_type": 字段的数据类型（integer[]）
    "name": 用户定义的字段名称
    "arraylen": 数组的长度
    "signed": 是否是有符号整数（true或者false）
    "bitcount": 字段的比特位数（1~64位）
    "order": 字段的字节存储顺序（大端字节序bigorder或者小端字节序smallorder）
    "encode": 字段的编码方式（primitive、inversion或者complement）
    "default": 字段的默认值


示例数据：

    {
        "seg_type": "integer[]",
        "name": "sxx",
        "arraylen":
        {
            "$type": "ExpNumber",
            "constNum": 34
        },
        "signed": true,
        "bitcount": 32,
        "order": "smallorder",
        "encode": "primitive"
    }

#### float[]

32位浮点数数组

    "seg_type": 字段的数据类型（float[]）
    "name": 用户定义的字段名称
    "arraylen": 数组的长度
    "order": 字段的字节存储顺序（大端字节序bigorder或者小端字节序smallorder）
    "encode": 字段的编码方式（primitive、inversion或者complement）
    "default": 字段的默认值


示例数据：

    {
        "seg_type": "float[]",
        "name": "afds",
        "arraylen":
        {
            "$type": "ExpDivide",
            "leftExp":
            {
                "$type": "ExpVar",
                "varName": "aaaa"
            },
            "rightExp":
            {
                "$type": "ExpNumber",
                "constNum": 8
            }
        }
        "order": "smallorder",
        "encode": "primitive"
    }

#### double[]

64位浮点数数组

    "seg_type": 字段的数据类型（float[]）
    "name": 用户定义的字段名称
    "arraylen": 数组的长度
    "order": 字段的字节存储顺序（大端字节序bigorder或者小端字节序smallorder）
    "encode": 字段的编码方式（primitive、inversion或者complement）
    "default": 字段的默认值


示例数据：

    {
        "seg_type": "double[]",
        "name": "afd2",
        "arraylen":
        {
            "$type": "ExpNumber",
            "constNum": 40
        }
        "order": "smallorder",
        "encode": "primitive"
    }

#### group[]

协议段分组数组

    "seg_type": 字段的数据类型（group[]）
    "name": 用户定义的字段名称
    "segments": 协议分组中的协议字段
    "arraylen": 数组的长度

示例数据：

    {
        "seg_type": "group[]",
        "name": "header",
        "segments": [
        {
            "seg_type": "float",
            "name": "aaa"
        },
        {
            "seg_type": "integer",
            "name": "aaa"
        }],
        "arraylen":
        {
            "$type": "ExpNumber",
            "constNum": 100
        }
    }

#### oneof

动态分支

    "seg_type": 字段的数据类型（oneof）
    "_selected_": 被选择的分支的序号
    "name": 用户定义的字段名称
    "items"：分支的内容，包括condition和segments
        "condition": 分支的执行条件
        "segments"：不同分支中定义的字段

示例数据：

    {
        "seg_type": "oneof",
        "_selected_": 0,
        "name": "oneof_segs",
        "items": [
        {
            "condition":
            {
                "$type": "ExpBeEqual",
                "leftExp":
                {
                    "$type": "ExpVar",
                    "varName": "TOKEN"
                },
                    "rightExp":
                {
                    "$type": "ExpNumber",
                    "constNum": 1
                }
            },
            "segments": [
            {
                "seg_type": "float",
                "name": "b_oneof1"
            },
            {
                "seg_type": "float",
                "name": "b_oneof2"
            }]
        }]
    }