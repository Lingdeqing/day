function shallowCopy(obj){
    var result = {}
    for(var i in obj){
        result[i] = obj[i]
    }
    return result
}

(function(exports){
    var types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' ');
    for(var i = 0, len = types.length; i < len; i++){
        exports['is'+types[i]] = (function(type){
            return function(obj){
                return Object.prototype.toString.call(obj).slice(8) === type
            }
        }(types[i]))
    }
})(typeof window === 'undefined' ? global : window)

function copy(obj, deep) {
    if(obj === null || (typeof obj !== 'object' && !isFunction(obj))){
        return obj
    }

    if(isFunction(obj)){
        return new Function('return '+obj.toString())() // obj上的属性和obj原型上的属性未考虑
    } else {
        var result = isArray(obj) ? [] : {}
        for(var name in obj){
            var value = obj[name]
            if(value === obj) continue  // 防止死循环

            if(deep){
                result[name] =  copy(value, deep)
            } else {
                result[name] = value
            }
        }
        return result
    }
}

var a = {
    a: 1,
    b: a,
    c: {
        a:1,
        b:2
    }
}
var d = copy(a, true)
console.log(d)