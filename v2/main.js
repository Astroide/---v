const $ = document.querySelector.bind(document);
/** @type {HTMLCanvasElement} */
const canvas = $('#code');
const ctx = canvas.getContext('2d');
let code = [
    [' ']
];
let cursor = [0, 0];
let running = false;
let runner = new Runner(code);
function inRect(x, y, x1, y1, w, h) {
    return x >= x1 && y >= y1 && x < x1 + w && y < y1 + h;
}
addEventListener('click', e => {
    if (inRect(e.pageX, e.pageY, 3, 3, 18, 18)) {
        running = !running;
        if (running) {
            __ThreadID__ = 0;
            runner = new Runner(code);
        } else {
            __ThreadID__ = 0;
        }
    } else if (!running && inRect(e.pageX, e.pageY, 18, 36, code.length * 18, code[0].length * 18)) {
        let x = e.pageX - 18;
        let y = e.pageY - 36;
        x = Math.floor(x / 18);
        y = Math.floor(y / 18);
        cursor = [x, y];
    }
    draw();
});
function draw() {
    ctx.clearRect(0, 0, 500, 800);
    ctx.font = '15px Courier';
    ctx.textBaseline = 'top';
    ctx.fillStyle = running ? 'green' : 'grey';
    ctx.fillRect(3, 3, 18, 18);
    ctx.fillStyle = 'black';
    ctx.fillText(running ? '◼︎' : '▶︎', 6, 6);
    if (!running) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(cursor[0] * 18 + 18, cursor[1] * 18 + 36, 18, 18);
    } else {
        const colors = [
            [280, 0, 0],
            [0, 280, 0],
            [0, 0, 280],
            [280, 280, 0],
            [0, 280, 280],
            [280, 0, 280]
        ];
        for (let i = 0; i < runner.threads.length; i++) {
            const thread = runner.threads[i];
            const color = colors[thread.id % colors.length];
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`;
            ctx.fillRect(thread.ip[0] * 18 + 18, thread.ip[1] * 18 + 36, 18, 18);
            for (let j = 0; j < thread.history.length; j++) {
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.45 / ((j / 3) + 1)})`;
                ctx.fillRect(thread.history[j][0] * 18 + 18, thread.history[j][1] * 18 + 36, 18, 18);
            }
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(thread.ip[0] * 18 + 18, thread.ip[1] * 18 + 36, 18, 18);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`;
            ctx.fillRect(i * 50, 500, 50, 20);
            ctx.fillStyle = 'black';
            ctx.fillText('#' + thread.id, 3 + i * 50, 500);
            for (let j = 0; j < thread.stack.items.length; j++) {
                ctx.fillText(thread.stack.items[i], 3 + i * 50, 500 + (j + 1) * 20);
            }
        }
    }
    ctx.fillStyle = 'black';
    for (let i = 0; i < code.length; i++) {
        for (let j = 0; j < code[i].length; j++) {
            ctx.fillText(code[i][j], i * 18 + 3 + 18, j * 18 + 3 + 36);
        }
    }
}

draw();

function update() {
    if (running) {
        runner.runStep();
    }
    draw();
    setTimeout(update, 250);
}

addEventListener('keydown', e => {
    if (running) return;
    switch (e.key) {
        case 'ArrowUp':
            cursor[1] -= 1;
            if (cursor[1] < 0) {
                cursor[1] = 0;
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            cursor[0] -= 1;
            if (cursor[0] < 0) {
                cursor[0] = 0;
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
            cursor[1]++;
            if (cursor[1] >= code[cursor[0]].length) {
                cursor[1] = code[cursor[0]].length - 1;
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            cursor[0]++;
            if (cursor[0] >= code.length) {
                cursor[0] = code.length - 1;
            }
            e.preventDefault();
            break;
        case 'Backspace':
            code[cursor[0]][cursor[1]] = ' ';
            // cursor[0]--;
            // if (cursor[0] < 0) {
            // cursor[0] = 0;
            // }
            break;
        case 'Enter':
        case 'Return':
            cursor[1]++;
            if (cursor[1] >= code[cursor[0]].length) {
                for (let i = 0; i < code.length; i++) {
                    code[i].push(' ');
                }
            }
            break;
        case ' ':
            e.preventDefault();
        default:
            if (e.key.toString() == 'Dead') {
                e = {
                    key: '^'
                };
            }
            if (e.key.length != 1) {
                console.log(e.key, e.key.toString() == 'Dead');
                break;
            }
            code[cursor[0]][cursor[1]] = e.key;
            cursor[0]++;
            if (cursor[0] >= code.length) {
                code.push([]);
                for (let i = 0; i < code[0].length; i++) {
                    code[code.length - 1].push(' ');
                }
            }
            break;

    }
    draw();
});

update();