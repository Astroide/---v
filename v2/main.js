const $ = document.querySelector.bind(document);
/** @type {HTMLCanvasElement} */
const canvas = $('#code');
const ctx = canvas.getContext('2d');
const codePage = {
    '20': ' ',
    '2a': '*',
    '2b': '+',
    '2c': ',',
    '2d': '-',
    '2e': '.',
    '2f': '/',
    '30': '0',
    '31': '1',
    '32': '2',
    '33': '3',
    '34': '4',
    '35': '5',
    '36': '6',
    '37': '7',
    '38': '8',
    '39': '9',
    '3a': ':',
    '3c': '<',
    '3e': '>',
    '41': 'A',
    '42': 'B',
    '43': 'C',
    '44': 'D',
    '45': 'E',
    '46': 'F',
    '47': 'G',
    '48': 'H',
    '49': 'I',
    '4a': 'J',
    '4b': 'K',
    '4c': 'L',
    '4d': 'M',
    '4e': 'N',
    '4f': 'O',
    '50': 'P',
    '51': 'Q',
    '52': 'R',
    '53': 'S',
    '54': 'T',
    '55': 'U',
    '56': 'V',
    '57': 'W',
    '58': 'X',
    '59': 'Y',
    '5a': 'Z',
    '5e': '^',
    '5f': '_',
    '60': '`',
    '61': 'a',
    '62': 'b',
    '63': 'c',
    '64': 'd',
    '65': 'e',
    '66': 'f',
    '67': 'g',
    '68': 'h',
    '69': 'i',
    '6a': 'j',
    '6b': 'k',
    '6c': 'l',
    '6d': 'm',
    '6e': 'n',
    '6f': 'o',
    '70': 'p',
    '71': 'q',
    '72': 'r',
    '73': 's',
    '74': 't',
    '75': 'u',
    '76': 'v',
    '77': 'w',
    '78': 'x',
    '79': 'y',
    '7a': 'z',
    '7c': '|',
};
let code = [
    [' ']
];
let speed = 4;
const transpose = array => array[0].map((_, colIndex) => array.map(row => row[colIndex]));
if (location.search) {
    const params = new URLSearchParams(location.search);
    if (params.get('code')) {
        code = fixCode(transpose(params.get('code').split('\n').map(line => line.split(''))));
    }
    if (params.get('speed')) {
        speed = parseInt(params.get('speed'));
    }
}

let cursor = [0, 0];
let running = false;
let runner = new Runner(code);
function fixCode(code) {
    // console.log(code);
    let maxLength = 0;
    for (let i = 0; i < code.length; i++) {
        const line = code[i];
        maxLength = Math.max(line.length, maxLength);
    }
    for (let i = 0; i < code.length; i++) {
        while (code[i].length < maxLength) {
            code[i].push(' ');
        }
    }
    // console.log(code);
    return code;
}
function inRect(x, y, x1, y1, w, h) {
    return x >= x1 && y >= y1 && x < x1 + w && y < y1 + h;
}
let mouseX = 0;
let mouseY = 0;
addEventListener('mousemove', e => {
    mouseX = e.pageX;
    mouseY = e.pageY;
});
function handleEvent(e) {
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
            if (running) break;
            code[cursor[0]][cursor[1]] = ' ';
            // cursor[0]--;
            // if (cursor[0] < 0) {
            // cursor[0] = 0;
            // }
            break;
        case 'Enter':
        case 'Return':
            if (running) break;
            cursor[1]++;
            if (cursor[1] >= code[cursor[0]].length) {
                for (let i = 0; i < code.length; i++) {
                    code[i].push(' ');
                }
            }
            break;
        case ' ':
            e.preventDefault();
            if (running) break;
        default:
            if (running) break;
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
}
function fakeEvent(key) {
    const e = {
        key,
        preventDefault() {
        }
    };
    handleEvent(e);
}
addEventListener('click', e => {
    if (inRect(e.pageX, e.pageY, 3, 3, 18, 18)) {
        running = !running;
        if (running) {
            __ThreadID__ = 0;
            runner = new Runner(transpose(fixCode(transpose(code).map(row => row.join('').trimEnd().split('')))));
            console.log(runner.code);
        } else {
            __ThreadID__ = 0;
        }
    } else if (inRect(e.pageX, e.pageY, 21, 3, 18, 18)) {
        navigator.clipboard.writeText(`${location.origin + location.pathname}?code=${encodeURIComponent(transpose(code).map(row => row.join('')).join('\n'))}&speed=${speed}`);
    } else if (inRect(e.pageX, e.pageY, 21 + 18, 3, 18, 18)) {
        speed = Math.max(1, speed - 1);
    } else if (inRect(e.pageX, e.pageY, 21 + 36, 3, 18, 18)) {
        speed = Math.min(1000, speed + 1);
    } else if (!running && inRect(e.pageX, e.pageY, canvas.width - 294, 36, 288, 288)) {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let index = j * 16 + i;
                let hex = index.toString(16).toLowerCase();
                if (codePage[hex] !== undefined) {
                    if (inRect(e.pageX, e.pageY, canvas.width - 294 + i * 18, j * 18 + 36, 18, 18)) {
                        fakeEvent(codePage[hex]);
                    }
                }
            }
        }
    } else {
        let metaX = e.pageX - 18 + (cursor[0] * 18 - (canvas.width - 318) + ((canvas.width - 300) / 2));
        let metaY = e.pageY - 36 + (cursor[1] * 18 - (canvas.height - 336) + 18 + ((canvas.height - 300) / 2));
        if (!running && inRect(metaX, metaY, 0, 0, code.length * 18, code[0].length * 18)) {
            let x = metaX;
            let y = metaY;
            x = Math.floor(x / 18);
            y = Math.floor(y / 18);
            cursor = [x, y];
        }
    }
    draw();
});
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}
addEventListener('resize', resize);
function applyTranslate() {
    ctx.translate(- (cursor[0] * 18 - (canvas.width - 318) + ((canvas.width - 300) / 2)), - (cursor[1] * 18 - (canvas.height - 336) + 18 + ((canvas.height - 300) / 2)));
}
function specialFillRect(x, y, w, h, a, b) {
    ctx.fillStyle = inRect(mouseX, mouseY, x, y, w, h) ? b : a;
    ctx.fillRect(x, y, w, h);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '15px Courier';
    ctx.textBaseline = 'top';
    specialFillRect(3, 3, 18, 18, running ? 'green' : '#ccc', running ? 'darkgreen' : '#888');
    ctx.fillStyle = 'black';
    ctx.fillText(running ? '◼︎' : '▶︎', 6, 6);
    specialFillRect(21, 3, 18, 18, '#ccc', '#888');
    ctx.fillStyle = 'black';
    ctx.fillText('⫘', 18 + 6, 6);
    specialFillRect(39, 3, 18, 18, '#ccc', '#888');
    ctx.fillStyle = 'black';
    ctx.fillText('v', 42 + 3, 6);
    specialFillRect(39 + 18, 3, 18, 18, '#ccc', '#888');
    ctx.fillStyle = 'black';
    ctx.fillText('^', 42 + 18 + 3, 6);
    ctx.fillText(`<>^v v2 ${running ? 'Running ' : ''}(${cursor[0]}, ${cursor[1]}) ${speed} TPS`, 24 + 18 + 36, 6);
    if (!running) {
        ctx.save();
        applyTranslate();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(cursor[0] * 18 + 18, cursor[1] * 18 + 36, 18, 18);
        ctx.restore();
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
            ctx.save();
            applyTranslate();
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
            ctx.restore();
            ctx.clearRect(i * 50, canvas.height - 300, 50, 300);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`;
            ctx.fillRect(i * 50, canvas.height - 300, 50, 20);
            ctx.fillStyle = 'black';
            ctx.fillText('#' + thread.id, 3 + i * 50, canvas.height - 300 + 3);
            for (let j = thread.stack.items.length - 1, k = 0; j >= 0; j--, k++) {
                ctx.fillText(`${j} ` + thread.stack.items[j], 3 + i * 50, canvas.height - 300 + (k + 1) * 20);
            }
        }
    }
    ctx.save();
    applyTranslate();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(18, 36, code.length * 18, code[0].length * 18);
    ctx.fillStyle = 'black';
    for (let i = 0; i < code.length; i++) {
        for (let j = 0; j < code[i].length; j++) {
            ctx.fillText(code[i][j], i * 18 + 3 + 18, j * 18 + 3 + 36);
        }
    }
    ctx.restore();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(canvas.width - 300, -10, 310, canvas.height + 20);
    ctx.clearRect(canvas.width - 299, -10, 310, canvas.height + 20);
    if (running) {
        ctx.fillStyle = 'black';
        ctx.fillText('------- Output -------', canvas.width - 300 + 3, 3);
        for (let i = runner.logs.length - Math.floor((canvas.height / 20) - 2), j = 0; i < runner.logs.length; i++) {
            if (i < 0) {
                continue;
            }
            ctx.fillText(runner.logs[i], canvas.width - 300 + 3, (j + 1) * 20 + 3);
            j++;
        }
    } else {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let index = j * 16 + i;
                let hex = index.toString(16).toLowerCase();
                if (codePage[hex] !== undefined) {
                    if (inRect(mouseX, mouseY, canvas.width - 294 + i * 18, j * 18 + 36, 18, 18)) {
                        ctx.fillStyle = '#888';
                    } else {
                        ctx.fillStyle = '#aaa';
                    }
                    ctx.fillRect(canvas.width - 294 + i * 18, j * 18 + 36, 18, 18);
                    ctx.fillStyle = 'black';
                    ctx.fillText(codePage[hex], canvas.width - 294 + i * 18 + 3, j * 18 + 36 + 3);
                }
            }
        }
    }
}

draw();

function update() {
    if (running) {
        runner.runStep();
    }
    draw();
    if (running) {
        setTimeout(update, 1000 / speed);
    } else {
        requestAnimationFrame(update);
    }
}

addEventListener('keydown', handleEvent);

update();
resize();