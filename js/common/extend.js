/**
 * 将后面的所有对象的自身的属性和方法复制给第一个对象
 * @param {Object} target 
 */
function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                target[key] = arguments[i][key];
            }
        }
    }
}