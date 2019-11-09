const NP = require('number-precision');
NP.enableBoundaryChecking(false);

//表达式抽象类
class Exp {
    constructor(exp_type) {
        this.$type = exp_type;
    }

    value_text(pre_var) {
        throw ('error value_text');
    }

    value_str() {
        throw ('error value_str');
    }

    value_bool() {
        throw ('error value_bool');
    }

    can_calc() {
        throw ('error is_calc');
    }

    get_para() {
        return null;
    }

    is_str() {
        return false;
    }

    *get_para_list() {
        let p = this.get_para();
        if(p) {
            yield p;
        }
        if(this.leftExp) {
            let pl = this.leftExp.get_para_list();
            p = pl.next();
            while(p.value) {
                yield p.value;
                p = pl.next();
            }
        }
        if(this.rightExp) {
            let pl = this.rightExp.get_para_list();
            p = pl.next();
            while(p.value) {
                yield p.value;
                p = pl.next();
            }
        }
        return null;
    }
}


//判断式基础类
class BinExp extends Exp {
    constructor(exp_type) {
        super(exp_type);
    }
    can_calc() {
        return false;
    }
}

//const string
class ExpConstString extends BinExp {
    constructor(constStr) {
        if (!constStr|| constStr.length<2) {
            throw ('error ExpConstString');
        }
        super('ExpConstString');
        if(constStr.length===2) {
            this.constStr = "";
        } else {
            this.constStr = constStr.substring(1, constStr.length-2);
        }
    }

    value_text() {
        return this.constStr;
    }

    value_str() {
        return this.constStr;
    }

    value_bool() {
        return !!this.constStr;
    }

    is_str() {
        return true;
    }
}

//not
class ExpNot extends BinExp {
    constructor(rightExp) {
        if (!rightExp) {
            throw ('error ExpNot');
        }
        super('ExpNot');
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '~' + this.rightExp.value_text(pre_var);
    }

    value_bool(ctx) {
        let right = this.rightExp.value_bool(ctx);
        return !right;
    }
}

//and
class ExpAnd extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpAnd');
        }
        super('ExpAnd');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + ' and ' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = this.leftExp.value_bool(ctx);
        let right = this.rightExp.value_bool(ctx);
        return (left && right);
    }
}

//or
class ExpOr extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpAnd');
        }
        super('ExpOr');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + ' or ' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = this.leftExp.value_bool(ctx);
        let right = this.rightExp.value_bool(ctx);
        return (left || right);
    }
}

//相等
class ExpBeEqual extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error BeequalExp');
        }
        super('ExpBeEqual');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '==' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = null;
        if (this.leftExp.can_calc(ctx)) {
            left = this.leftExp.value_num(ctx);
        } else if(this.leftExp.is_str(ctx)) {
            left = this.leftExp.value_str(ctx);
        } else {
            left = this.leftExp.value_bool(ctx);
        }

        let right = null;
        if (this.rightExp.can_calc(ctx)) {
            right = this.rightExp.value_num(ctx);
        } else if(this.rightExp.is_str(ctx)) {
            right = this.rightExp.value_str(ctx);
        } else {
            right = this.rightExp.value_bool(ctx);
        }
        return (left === right);
    }
}

//不相等
class ExpNotEqual extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpNotequal');
        }
        super('ExpNotEqual');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '~=' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = null;
        if (this.leftExp.can_calc(ctx)) {
            left = this.leftExp.value_num(ctx);
        } else if(this.leftExp.is_str(ctx)) {
            left = this.leftExp.value_str(ctx);
        } else {
            left = this.leftExp.value_bool(ctx);
        }
        let right = null;
        if (this.rightExp.can_calc(ctx)) {
            right = this.rightExp.value_num(ctx);
        } else if(this.rightExp.is_str(ctx)) {
            right = this.rightExp.value_str(ctx);
        } else {
            right = this.rightExp.value_bool(ctx);
        }
        return (left !== right);
    }
}

//大于
class ExpGreater extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpGreater');
        }
        super('ExpGreater');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '>' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = this.leftExp.value_num(ctx);
        let right = this.rightExp.value_num(ctx);
        return (left > right);
    }
}

//大于等于
class ExpGreaterEqual extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpGreaterEqual');
        }
        super('ExpGreaterEqual');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '>=' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = this.leftExp.value_num(ctx);
        let right = this.rightExp.value_num(ctx);
        return (left >= right);
    }
}

//小于
class ExpLess extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpLess');
        }
        super('ExpLess');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '<' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = this.leftExp.value_num(ctx);
        let right = this.rightExp.value_num(ctx);
        return (left < right);
    }
}

//小于等于
class ExpLessEqual extends BinExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpLessEqual');
        }
        super('ExpLessEqual');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '<=' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let left = this.leftExp.value_num(ctx);
        let right = this.rightExp.value_num(ctx);
        return (left <= right);
    }
}

//计算式基础类
class CalcExp extends Exp {
    constructor(exp_type) {
        super(exp_type);
    }
    value_num() {
        throw ('error value_num');
    }
}

//变量
class ExpVar extends CalcExp {
    constructor(var_id) {
        if (!var_id) {
            throw ("error ExpNumber")
        }
        super('ExpVar');
        this.varName = var_id;
    }
    value_num(ctx) {
        return ctx[this.varName];
    }

    value_text(pre_var) {
        if(pre_var) {
            return pre_var + "." + this.varName;
        }
        return this.varName;
    }

    value_str(ctx) {
        return ctx[this.varName];
    }

    value_bool(ctx) {
        if (!ctx[this.varName]) {
            return false;
        } else {
            return true;
        }
    }

    is_str(ctx) {
        return (ctx[this.varName] && (typeof ctx[this.varName]==='string'))
    }

    can_calc(ctx) {
        return(ctx[this.varName] && !isNaN(ctx[this.varName]))
    }

    get_para() {
        return this.varName;
    }
}

//数字
class ExpNumber extends CalcExp {
    constructor(num) {
        if (isNaN(num)) {
            throw ("error ExpNumber")
        }
        super('ExpNumber');
        this.constNum = Number(num);
    }

    value_num() {
        return this.constNum;
    }

    value_text() {
        return (NP.strip(this.constNum)).toString();
    }

    value_bool() {
        return NP.strip(this.constNum) !== 0;
    }

    can_calc() {
        return true;
    }
}

//加法
class ExpPlus extends CalcExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpPlus');
        }
        super('ExpPlus');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_num(ctx) {
        return NP.plus(this.leftExp.value_num(ctx), this.rightExp.value_num(ctx));
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '+' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let res = this.value_num(ctx);
        return (res != 0);
    }

    can_calc(ctx) {
        return this.leftExp.can_calc(ctx) && this.rightExp.can_calc(ctx);
    }
}

//减法
class ExpMinus extends CalcExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpMinus');
        }
        super('ExpMinus');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_num(ctx) {
        return NP.minus(this.leftExp.value_num(ctx), this.rightExp.value_num(ctx));
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '-' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let res = this.value_num(ctx);
        return (res != 0);
    }

    can_calc(ctx) {
        return this.leftExp.can_calc(ctx) && this.rightExp.can_calc(ctx);
    }
}

//乘法
class ExpTimes extends CalcExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpTimes');
        }
        super('ExpTimes');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_num(ctx) {
        return NP.times(this.leftExp.value_num(ctx), this.rightExp.value_num(ctx));
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '*' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let res = this.value_num(ctx);
        return (res != 0);
    }

    can_calc(ctx) {
        return this.leftExp.can_calc(ctx) && this.rightExp.can_calc(ctx);
    }
}

//除法
class ExpDivide extends CalcExp {
    constructor(leftExp, rightExp) {
        if (!leftExp || !rightExp) {
            throw ('error ExpDivide');
        }
        super('ExpDivide');
        this.leftExp = leftExp;
        this.rightExp = rightExp;
    }

    value_num(ctx) {
        return NP.divide(this.leftExp.value_num(ctx), this.rightExp.value_num(ctx));
    }

    value_text(pre_var) {
        return '(' + this.leftExp.value_text(pre_var) + '/' + this.rightExp.value_text(pre_var) + ')';
    }

    value_bool(ctx) {
        let res = this.value_num(ctx);
        return (res != 0);
    }

    can_calc(ctx) {
        return this.leftExp.can_calc(ctx) && this.rightExp.can_calc(ctx);
    }
}


module.exports = {
    ExpVar,
    ExpNumber,
    ExpPlus,
    ExpMinus,
    ExpTimes,
    ExpDivide,
    ExpBeEqual,
    ExpNotEqual,
    ExpGreater,
    ExpGreaterEqual,
    ExpLess,
    ExpLessEqual,
    ExpNot,
    ExpAnd,
    ExpOr,
    ExpConstString
}