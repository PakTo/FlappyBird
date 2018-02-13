/**
 * 图片加载器，将多张图片加载完毕后执行回调函数
 * @param {Object} options 
 * @param {Function} fn 
 */
function imgLoad(options, fn) {
    var totalImg = 0,
        imgLoaded = 0;
    for (var key in options) {
        totalImg++;
        var img = new Image();
        img.src = options[key];
        options[key] = img;
        img.onload = function () {
            if (++imgLoaded === totalImg) {
                fn(options);
            }
        }
    }
}