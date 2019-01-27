export default class Mouse {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;

        canvas.addEventListener('mousemove', (evt) => {
            let rect = canvas.getBoundingClientRect();
            this.x = evt.clientX - rect.left,
            this.y = evt.clientY - rect.top
        })
    }
}