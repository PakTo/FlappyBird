/**
 * @constructor 背景天空构造函数
 * @param {Object} options 配置项
 * @param {CanvasRenderingContext2D} options.ctx Canvas上下文
 * @param {Number} options.x Canvas中初始x坐标
 * @param {Number} options.y Canvas中初始y坐标
 * @param {HTMLImageElement} options.img 图片资源
 * @param {Number} options.speed 运动速度
 */
function Sky(options) {
    this.ctx = options.ctx;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.img = options.img;
    this.w = this.img.width;
    this.h = this.img.height;
    this.imgNeed = Math.ceil(this.ctx.canvas.width / this.w) + 1;
    this.speed = options.speed || 3;
}
extend(Sky.prototype, {
    draw: function () {
        for (var i = 0; i < this.imgNeed; i++) {
            this.ctx.drawImage(this.img, this.x + i * this.w, this.y);
        }
        this.update();
    },
    update: function () {
        this.x -= this.speed;
        if (this.w + this.x <= this.speed) {
            this.x = 0;
        }
    }
});

/**
 * @constructor 背景大地构造函数
 * @param {Object} options 配置项
 * @param {CanvasRenderingContext2D} options.ctx Canvas上下文
 * @param {Number} options.x Canvas中初始x坐标
 * @param {Number} options.y Canvas中初始y坐标
 * @param {Image} options.img 图片资源
 * @param {Number} options.speed 运动速度
 */
function Land(options) {
    Sky.call(this, options);
    this.y = options.y || this.ctx.canvas.height - this.img.height;
}
extend(Land.prototype, Sky.prototype);

/**
 * 计时器
 * @constructor 计时器构造函数
 * @param {Object} options 配置项
 * @param {CanvasRenderingContext2D} options.ctx Canvas上下文
 * @param {Number} options.x Canvas中初始x坐标
 * @param {Number} options.y Canvas中初始y坐标
 * @param {String} options.fillStyle 字体颜色
 * @param {String} options.font 字体
 * @param {String} options.fillText 描述文字
 * @param {String} options.textAlign 文字水平对齐方式
 * @param {String} options.textBaseline 文字垂直对齐方式
 */
function Timer(options) {
    this.ctx = options.ctx;
    this.x = options.x || this.ctx.canvas.width;
    this.y = options.y || 0;
    this.textAlign = options.textAlign || 'right';
    this.textBaseline = options.textBaseline || 'hanging';
    this.fillStyle = options.fillStyle || '#000000';
    this.font = options.font || '700 20px 微软雅黑';
    this.fillText = options.fillText || '';
    this.isStart = false;
    this.startTime = 0;
    this.endTime = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.time = 0;
    this.gameRunTime = this.endTime - this.startTime;
}
extend(Timer.prototype, {
    draw: function () {
        if (!this.isStart) {
            this.isStart = true;
            this.startTime = this.endTime = Date.now();
        }
        this.ctx.save();
        this.ctx.textAlign = this.textAlign;
        this.ctx.textBaseline = this.textBaseline;
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.font = this.font;
        this.ctx.fillText(this.fillText + this.format(), this.x, this.y);
        this.ctx.restore();
        this.update();
    },
    update: function () {
        this.endTime = Date.now();
        this.gameRunTime = this.endTime - this.startTime;
    },
    format: function (number) {
        var time = number || this.gameRunTime;
        var hour = Math.floor(time / 1000 / 60 / 60);
        var minute = Math.floor((time - hour * 60 * 60 * 1000) / 1000 / 60);
        var second = Math.floor(time / 1000 % 60);
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.time = this.hour * 3600 + this.minute * 60 + this.second;
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        return hour + '小时' + minute + '分钟' + second + '秒!!!';
    }
});

/**
 * @constructor 小鸟模型构造函数
 * @param {Object} options 配置项
 * @param {CanvasRenderingContext2D} options.ctx Canvas上下文
 * @param {Number} options.x Canvas中初始x坐标
 * @param {Number} options.y Canvas中初始y坐标
 * @param {HTMLImageElement} options.img 图片资源
 * @param {Number} options.speed 下降速度
 */
function Bird(options) {
    this.ctx = options.ctx;
    this.img = options.img;
    this.widthFrame = options.widthFrame;
    this.heightFrame = options.heightFrame;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.speed = options.speed || 2;
    this.gravity = options.gravity || 0.3;
    this.w = this.img.width / this.widthFrame;
    this.h = this.img.height / this.heightFrame;
    this.rotateRad = 0;
    this.maxRad = options.maxRad || Math.PI / 3;
    this.index = 0;
}
extend(Bird.prototype, {
    draw: function () {
        this.ctx.save();
        this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        this.ctx.rotate(this.rotateRad);
        this.ctx.drawImage(this.img, this.index * this.w, 0, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);
        this.update();
        this.ctx.restore();
    },
    update: function () {
        this.index = ++this.index % this.widthFrame;
        this.y += this.speed;
        this.speed += this.gravity;
        this.rotateRad += 0.03;
        if (this.rotateRad >= this.maxRad) {
            this.rotateRad = this.maxRad;
        }
    },
    fly: function () {
        this.rotateRad = -Math.PI / 4;
        this.speed = -5;
    }
})

/**
 * 上下油管对象
 * @param {Object} options 配置项
 * @param {CanvasRenderingContext2D} options.ctx Canvas上下文
 * @param {Number} options.x Canvas中初始x坐标
 * @param {HTMLImageElement} options.imgPipeDown 图片资源
 * @param {HTMLImageElement} options.imgPipeUp 图片资源
 * @param {Number} options.horizontalSpace 左右间距
 * @param {Number} options.verticalSpace 上下间距
 * @param {Number} options.speed 运动速度
 * @param {Number} options.aSpeed 运动加速度
 * @param {Number} options.minHeight 管道最小高度
 * @param {Number} options.maxHeight 管道最大高度
 */
function Pipe(options) {
    this.ctx = options.ctx;
    this.x = options.x || 0;
    this.imgPipeDown = options.imgPipeDown;
    this.imgPipeUp = options.imgPipeUp;
    this.w = this.imgPipeDown.width;
    this.h = this.imgPipeDown.height;
    this.horizontalSpace = options.horizontalSpace;
    this.verticalSpace = options.verticalSpace;
    this.speed = options.speed || 3;
    // this.aSpeed = options.aSpeed || 0.001;
    this.aSpeed = options.aSpeed || 0;
    this.minHeight = options.minHeight || 50;
    var maxHeight = this.ctx.canvas.height - 112 - this.minHeight - this.verticalSpace;
    this.maxHeight = options.maxHeight < maxHeight ? options.maxHeight : maxHeight;
    this.imgNeed = Math.ceil(this.ctx.canvas.width / (this.w + this.horizontalSpace));
    this.yUp = [];
    this.yDown = [];
    this.initPipeY();
}
extend(Pipe.prototype, {
    random: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    initPipeY: function () {
        for (var i = 0; i < this.imgNeed; i++) {
            this.yDown[i] = this.random(this.minHeight, this.maxHeight) - this.h;
            this.yUp[i] = this.yDown[i] + this.h + this.verticalSpace;
        }
    },
    draw: function () {
        this.ctx.beginPath();
        for (var i = 0; i < this.imgNeed; i++) {
            this.ctx.rect(this.x + i * (this.w + this.horizontalSpace), this.yDown[i], this.w, this.h);
            this.ctx.rect(this.x + i * (this.w + this.horizontalSpace), this.yUp[i], this.w, this.h);
            this.ctx.drawImage(this.imgPipeDown, this.x + i * (this.w + this.horizontalSpace), this.yDown[i]);
            this.ctx.drawImage(this.imgPipeUp, this.x + i * (this.w + this.horizontalSpace), this.yUp[i]);
        }
        this.update();
    },
    update: function () {
        this.x -= this.speed;
        if (this.w + this.x <= this.speed) {
            this.yUp.shift();
            this.yDown.shift();
            this.x += this.w + this.horizontalSpace;
            this.yDown.push(this.random(this.minHeight, this.maxHeight) - this.h);
            this.yUp.push(this.yDown[this.yDown.length - 1] + this.h + this.verticalSpace);
        }
        this.speed += this.aSpeed;
    }
})