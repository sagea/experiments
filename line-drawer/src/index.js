var rangeElem = document.querySelector('#speedSlider');
var savedTextarea = document.querySelector('#saved');
var UpdateButton = document.querySelector('#updateButton');
var stopButton = document.querySelector('#stopBtn');
var continueButton = document.querySelector('#continueBtn');
var canvasLines = document.querySelector('#canvasLines');
var canvasPath = document.querySelector('#canvasPath');
var ctxLines = canvasLines.getContext('2d');
var ctxPaths = canvasPath.getContext('2d');
var lines = [];
var lastPath;
var firstPath;
var stopped = false;
var animationFrame;
var drawSpeed = 20;
var options = {
    start: {
        x: 960,
        y: 540
    }
}



const init = () => {
    parseSaved();
    animate();
}

const clear = () => {
    ctxPaths.clearRect(0, 0, 1920, 1080);
    ctxLines.clearRect(0, 0, 1920, 1080);
    lines = [];
    lastPath = null;
    stopped = false;
    window.cancelAnimationFrame(animationFrame);
}

const handleUpdateClick = () => {
    clear();
    init();
}

const parseSaved = () => {
    var string = savedTextarea.value.trim().split('\n');
    var lineData = string
        .map(trim)
        .filter(isFalsy)
        .map(line =>
            line
                .split(' ')
                .map(trim)
                .map(toNumber)
        );

    var firstLine = lineData.shift();
    lines.push(new LineObject(options.start.x, options.start.y, ...firstLine))
    lineData.forEach(line => {
        lines.push(new LineObject(0, 0, ...line, lines[lines.length - 1]));
    });
}

const animate = () => {
    draw(drawSpeed);
    animationFrame = window.requestAnimationFrame(animate);
}

const draw = (times = 1) => {
    ctxLines.clearRect(0, 0, 1920, 1080);
    for (var i = 0; i < times; i++) {
        lines.forEach(line => line.update());
        renderPath(lines[lines.length - 1]);
    }
    lines.forEach(line => line.render());
}

const renderPath = (last) => {
    if (lastPath) {
        ctxPaths.save();
        ctxPaths.beginPath();
        ctxPaths.strokeStyle = 'black';
        ctxPaths.moveTo(lastPath.x, lastPath.y);
        ctxPaths.lineTo(last.to.x, last.to.y);
        ctxPaths.stroke();
        ctxPaths.restore();
    }

    lastPath = {
        x: last.to.x,
        y: last.to.y
    };
}

function LineObject (x = 200, y = 200, length = 10, speed = 1, parent) {
    this.from = {
        x,
        y
    };
    this.to = {
        x: 0,
        y: 0
    };
    this.length = length;
    this.rotation = 0;
    this.parent = parent;
    this.speed = speed;
}
LineObject.prototype = {
    update() {
        this.rotation += this.speed;
        var rotation = toRad(this.rotation);
        this.from = this.parent ?
            this.parent.to :
            this.from;
        this.to.x = this.from.x + (Math.cos(rotation) * this.length);
        this.to.y = this.from.y + (Math.sin(rotation) * this.length);
    },
    render() {
        ctxLines.save();
        ctxLines.beginPath();
        ctxLines.moveTo(this.from.x, this.from.y);
        ctxLines.lineTo(this.to.x, this.to.y);
        ctxLines.stroke();
        ctxLines.restore();
    }
}
rangeElem.addEventListener('input', event => {
    drawSpeed = parseInt(event.target.value);
});
rangeElem.value = drawSpeed;
UpdateButton.addEventListener('click', handleUpdateClick);
stopButton.addEventListener('click', function () {
    window.cancelAnimationFrame(animationFrame);
    ctxLines.clearRect(0, 0, 1920, 1080);
});
continueButton.addEventListener('click', function () {
    animate();
});


/* Utility */

function toRad(num) {
    return num * (Math.PI / 180);
}

function toNumber(val) {
    return +val;
}

function isFalsy(val) {
    return !!val.trim();
}

function trim(val) {
    return val.trim();
}