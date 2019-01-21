import Mouse from './Mouse'
import Ball from './Balls'

let canvas = document.querySelector('.canvas');
let ctx = canvas.getContext('2d');
let ctxHeight = window.innerHeight;
let ctxWidth = window.innerWidth;
let mousePos = new Mouse(canvas);

let balls = [];
let ballsCount = 20;

canvas.height = ctxHeight;
canvas.width = ctxWidth;

let mouseBall = new Ball(mousePos.x, mousePos.y, 160, 'white');

for (let i = 0; i < ballsCount; i++) {
    balls.push(new Ball(
        ctxWidth / 2 + 200 * Math.cos(i / (ballsCount/2)* Math.PI),
        ctxHeight / 2 + 200 * Math.sin(i / (ballsCount/2)* Math.PI),
        3
    ))
}

let grd = ctx.createLinearGradient(ctxHeight / 6, ctxWidth/7, ctxWidth / 2, 0);
grd.addColorStop(0, "red");
grd.addColorStop(1, "orange");

function ConnectDots(dots) {
    ctx.save();
    ctx.beginPath();
    for (var i = 0, jlen = dots.length; i <= jlen; ++i) {
        var p0 = dots[i + 0 >= jlen ? i + 0 - jlen : i + 0];
        var p1 = dots[i + 1 >= jlen ? i + 1 - jlen : i + 1];
        ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.strokeStyle = grd;
    ctx.fill();
    // ctx.stroke();
    ctx.restore();
}

function Render() {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);

    mouseBall.updatePosition(mousePos.x, mousePos.y);
    mouseBall.draw(ctx);

    balls.forEach(ball => {
        ball.phys(mouseBall, balls);
        // ball.draw(ctx);
    })
    ConnectDots(balls);
    requestAnimationFrame(Render);
}

Render();