import Mouse from './Mouse'
import Ball from './Balls'
import SvgParse from './SvgParse'
import * as dat from 'dat.gui';

let canvas = document.querySelector('.canvas');
let ctx = canvas.getContext('2d');
let ctxHeight = 860;
let ctxWidth = 860;
let mousePos = new Mouse(canvas);

// Gradient Yellow
let grd = ctx.createLinearGradient(ctxHeight / 6, ctxWidth / 8, ctxWidth / 2, 0);
grd.addColorStop(0, "#FACC2E");
grd.addColorStop(1, "#FF8000");

// Array of shapes id and settings
let shapes = [{
    shape: '#white',
    x: 0,
    y: 0,
    scale: 40,
    color: 'white',
    dotsCount: 20
}, {
    shape: '#yellow',
    x: 0,
    y: 0,
    scale: 40,
    color: grd,
    dotsCount: 10
}];

// Final objects
let Objects = []

canvas.height = ctxHeight;
canvas.width = ctxWidth;

let settingsObj = {
    spring: 0.9,
    friction: 0.08,
    skeleton: false, // Not fill objects if true
    mouse: false // Draw mouse ball if true
}

var gui = new dat.gui.GUI();
gui.add(settingsObj, 'spring').min(0.01).max(0.95).step(0.01);
gui.add(settingsObj, 'friction').min(0.01).max(0.95).step(0.01);
gui.add(settingsObj, 'skeleton');
gui.add(settingsObj, 'mouse');

let mouseBall = new Ball(mousePos.x, mousePos.y, 160, 'rgba(0,0,0, 0.2)');

// Convert shapes array into final objects
shapes.forEach(shape => {
    let object = {};
    object.color = shape.color;
    object.dots = [];
    SvgParse(shape.shape, shape.dotsCount, shape.x, shape.y, shape.scale).forEach(dot => {
        object.dots.push(new Ball(dot[0], dot[1], 4, 'white'));
    });
    Objects.push(object)
})

// Connect dots with curve line
function ConnectDots(object) {
    let dots = object.dots;
    ctx.save();
    ctx.beginPath();
    for (var i = 0, jlen = dots.length; i <= jlen; ++i) {
        var p0 = dots[i + 0 >= jlen ? i + 0 - jlen : i + 0];
        var p1 = dots[i + 1 >= jlen ? i + 1 - jlen : i + 1];
        ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }
    ctx.closePath();
    ctx.fillStyle = object.color;
    ctx.strokeStyle = grd;
    ctx.lineWidth = 4;
    ctx.shadowColor = '#D8D8D8';
    ctx.shadowBlur = 15;
    if (settingsObj.skeleton) {
        ctx.stroke();
    } else ctx.fill();
    ctx.restore();
}

function Render() {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);

    mouseBall.updatePosition(mousePos.x, mousePos.y);

    // Draw and animate every shape
    Objects.forEach(object => {
        ConnectDots(object);
        object.dots.forEach(dot => {
            dot.spring();
            dot.phys(mouseBall);
            if (settingsObj.skeleton) {
                dot.draw(ctx);
            }
            dot.updateVars(settingsObj);
        })
    })

    if(settingsObj.mouse){
        mouseBall.draw(ctx);
    }
    requestAnimationFrame(Render);
}

Render();