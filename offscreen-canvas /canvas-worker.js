const animate = (frameCallback) => {
    let lastFrameTime = performance.now();
    const frame = () => {
        const currentFrameTime = performance.now();
        frameCallback({
            currentFrameTime,
            lastFrameTime,
            deltaTime: currentFrameTime - lastFrameTime,
        });
        lastFrameTime = currentFrameTime;
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};


onmessage = e => {
    const canvas = e.data.canvas;
    const ctx = canvas.getContext('2d');
    let xd = 0;
    let x = 0;
    let last = performance.now();
    animate(({ deltaTime, lastFrameTime, currentFrameTime }) => {
        const fps = 1 / ((currentFrameTime - lastFrameTime) / 1000);
        ctx.clearRect(0, 0, 1920, 1080);
        xd += deltaTime * .5;
        x += 10;
        if (x > 1920) x -= (1920 + 50);
        if (xd > 1920) xd -= (1920 + 50);

        rect(x, 10, 50, 50, { color: 'black' })(ctx);
        rect(xd, 80, 50, 50, { color: 'pink' })(ctx);
        text(Math.floor(fps), {
            x: 10,
            y: 100,
            font: '100px Arial',
            color: 'deepSkyBlue',
        })(ctx);
    });
}

const text = (message, { x, y, color, font }) => ctx => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(message, x, y);
    ctx.restore();
};

const rect = (x, y, width, height, { color }={}) => ctx => {
    ctx.save();
    color && (ctx.fillStyle = color);
    ctx.fillRect(x, y, width, height);
    ctx.restore();
}
