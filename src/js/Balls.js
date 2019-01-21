export default class Ball {
    constructor(x, y, radius, color) {
        // Look
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius || 5;

        // Phys
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.8;
        this.springForce = 0.1;

        this.originalX = x || 0;
        this.originalY = y || 0;

    }

    updatePosition(x, y) {
        this.y = y;
        this.x = x;
    }

    phys(mouse, balls) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius + this.radius) {
            let angle = Math.atan2(dy, dx);
            let tx = mouse.x + Math.cos(angle) * (mouse.radius + this.radius);
            let ty = mouse.y + Math.sin(angle) * (mouse.radius + this.radius);

            this.vx += tx - this.x;
            this.vy += ty - this.y;
        }

        // Spring
        let dx1 = this.x - this.originalX;
        let dy1 = this.y - this.originalY;
        this.vx += -(dx1 * this.springForce);
        this.vy += -(dy1 * this.springForce);

        // Friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Final velocity
        this.x += this.vx;
        this.y += this.vy;

        balls.forEach((ball, current) => {
            ball.vx += this.vx * 0.001 * current
            ball.vy += this.vy * 0.001 * current
        })
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color || 'green';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}