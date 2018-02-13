/**
 * 在容器里插入一个宽高设定好的canvas画布，并返回画布的上下文
 * @param {String} containerSelector 
 * @param {Number} width 
 * @param {Number} height 
 * @return {CanvasRenderingContext2D} ctx
 */
function getContext(containerSelector, width, height) {
    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext('2d');
    cvs.width = width;
    cvs.height = height;
    document.querySelector(containerSelector).appendChild(cvs);
    return ctx;
}