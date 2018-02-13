/**
 * flappyBird开始游戏函数
 * @param {Object} imgObj 
 * @param {Number} speed 
 */
function flappyBird(imgObj, speed) {
    var ctx = getContext('body', imgObj.sky.width, imgObj.sky.height),
        text = '',
        best, bestText, sky, land, timer, bird, pipe;
    start();

    function loop() {
        requestAnimationFrame(function () {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            sky.draw();
            pipe.draw();
            land.draw();
            timer.draw();
            bird.draw();
            if (isDefeated(bird)) {
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (timer.hour > 0) {
                    text = timer.hour + '小时' + timer.minute + '分钟' + timer.second + '秒';
                } else if (timer.minute > 0) {
                    text = timer.minute + '分钟' + timer.second + '秒';
                } else {
                    text = timer.second + '秒';
                }
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'orange';
                ctx.font = '700 50px 微软雅黑';
                ctx.fillText('您的成绩：' + text, ctx.canvas.width / 2, ctx.canvas.height / 2 - 60);
                if (timer.time > best) {
                    ctx.font = '700 60px 微软雅黑';
                    ctx.fillStyle = "yellow";
                    best = timer.time;
                    localStorage.setItem('flappyBirdBestScore', best);
                    ctx.fillText('新纪录诞生！！！', ctx.canvas.width / 2, 100);
                }
                bestText = timer.format(best * 1000);
                ctx.fillStyle = 'red';
                ctx.font = '700 40px 微软雅黑';
                ctx.fillText('最好成绩：' + bestText, ctx.canvas.width / 2, ctx.canvas.height / 2);
                ctx.beginPath();
                ctx.rect(ctx.canvas.width / 2 - 80, ctx.canvas.height / 2 + 50, 160, 60);
                ctx.stroke();
                ctx.fillStyle = "hotpink";
                ctx.font = "700 30px 微软雅黑";
                ctx.fillText('重新开始', ctx.canvas.width / 2, ctx.canvas.height / 2 + 80);
                ctx.canvas.addEventListener('click', restart);
            } else {
                loop();
            }
        })
    }
    loop();
    ctx.canvas.addEventListener('click', function () {
        bird.fly();
    });
    document.onkeydown = function (e) {
        if (e.keyCode === 32) {
            bird.fly();
        }
    };

    function start() {
        if (localStorage.getItem('flappyBirdBestScore')) {
            best = localStorage.getItem('flappyBirdBestScore');
        } else {
            best = 0;
            localStorage.setItem('flappyBirdBestScore', 0);
        }
        sky = new Sky({
            ctx: ctx,
            img: imgObj.sky,
            speed: speed
        });
        land = new Land({
            ctx: ctx,
            img: imgObj.land,
            speed: speed
        });
        timer = new Timer({
            ctx: ctx,
            fillText: '您已经坚持了',
            fillStyle: 'hotpink'
        });
        bird = new Bird({
            ctx: ctx,
            img: imgObj.bird,
            widthFrame: 3,
            heightFrame: 1,
            x: 50,
            y: 50
        });
        pipe = new Pipe({
            ctx: ctx,
            imgPipeDown: imgObj.pipeDown,
            imgPipeUp: imgObj.pipeUp,
            x: 500,
            verticalSpace: 100,
            horizontalSpace: 150
        });
    }

    function restart(e) {
        if (ctx.isPointInPath(e.pageX - ctx.canvas.offsetLeft, e.pageY - ctx.canvas.offsetTop)) {
            start();
            ctx.beginPath();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            loop();
            ctx.canvas.removeEventListener('click', restart);
        }
    }

    function isDefeated(bird) {
        if (bird.y + bird.h / 2 >= ctx.canvas.height - imgObj.land.height || bird.y + bird.h / 2 <= 0) {
            return true;
        }
        if (ctx.isPointInPath(bird.x + bird.w / 2, bird.y + bird.h / 2)) {
            return true;
        }
        return false;
    }
}

function FlappyBird(){
    
}