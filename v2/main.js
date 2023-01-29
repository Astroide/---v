const $ = document.querySelector.bind(document);
/** @type {HTMLCanvasElement} */
const canvas = $('#code');
const ctx = canvas.getContext('2d');
const codePage = {
    '20': [' ', 'No-op', 'Rien'],
    '21': ['!', 'Negate', 'Inverser (vrai => faux, faux => vrai)'],
    '23': ['#', 'Trampoline - skip next', 'Trampoline : sauter la prochaine instruction'],
    '25': ['%', 'Modulo', 'Modulo'],
    '2a': ['*', 'Multiply', 'Multiplier'],
    '2b': ['+', 'Add / Concatenate', 'Additionner'],
    '2c': [',', 'Print with newline', 'Afficher la valeur'],
    '2d': ['-', 'Substract', 'Soustraire'],
    '2e': ['.', 'Dot in number literals', 'Point décimal'],
    '2f': ['/', 'Divide', 'Diviser'],
    '30': ['0', 'Corresponding digit in number literals', 'Pour les nombres'],
    '31': ['1', 'Corresponding digit in number literals', 'Pour les nombres'],
    '32': ['2', 'Corresponding digit in number literals', 'Pour les nombres'],
    '33': ['3', 'Corresponding digit in number literals', 'Pour les nombres'],
    '34': ['4', 'Corresponding digit in number literals', 'Pour les nombres'],
    '35': ['5', 'Corresponding digit in number literals', 'Pour les nombres'],
    '36': ['6', 'Corresponding digit in number literals', 'Pour les nombres'],
    '37': ['7', 'Corresponding digit in number literals', 'Pour les nombres'],
    '38': ['8', 'Corresponding digit in number literals', 'Pour les nombres'],
    '39': ['9', 'Corresponding digit in number literals', 'Pour les nombres'],
    '3a': [':', 'Duplicate top of stack', 'Dupliquer le dessus de la pile'],
    '3b': [';', 'Like \',\', but without popping', 'Comme \',\', mais sans l\'enlever de la pile'],
    '3c': ['<', 'IP <', 'Envoyer le pointer d\'instructions vers la gauche'],
    '3d': ['=', 'Equals', 'Tester l\'égalité entre les deux éléments du dessus de la pile'],
    '3e': ['>', 'IP >', 'Envoyer le pointer d\'instructions vers la droite'],
    '3f': ['?', 'If - execute next only if pop()', 'Si - exécuter la prochaine instruction seulement si le dessus de la pile est vrai'],
    '41': ['A', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '42': ['B', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '43': ['C', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '44': ['D', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '45': ['E', 'Push the value of the E register onto the stack', 'Mettre la valeur du registre E sur la pile'],
    '46': ['F', 'Push false', 'Mettre \'faux\' sur la pile'],
    '47': ['G', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '48': ['H', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '49': ['I', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '4a': ['J', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '4b': ['K', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '4c': ['L', 'Wrap around when reaching edge (must be on an edge, otherwise no-op)', 'Continuer sur le bord opposé du programme'],
    '4d': ['M', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '4e': ['N', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '4f': ['O', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '50': ['P', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '51': ['Q', 'Push the value of the Q register onto the stack', 'Mettre la valeur du registre Q sur la pile'],
    '52': ['R', 'Push the value of the R register onto the stack', 'Mettre la valeur du registre R sur la pile'],
    '53': ['S', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '54': ['T', 'Push true', 'Mettre \'vrai\' sur le dessus de la pile'],
    '55': ['U', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '56': ['V', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '57': ['W', 'Push the value of the W register onto the stack', 'Mettre la valeur du registre W sur la pile'],
    '58': ['X', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '59': ['Y', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '5a': ['Z', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '5c': ['\\', 'Escape backticks, ^<>v control characters and backslashes within strings', 'Pour pouvoir utiliser les caractères de contrôle dans le texte'],
    '5e': ['^', 'IP ^', 'Envoyer le pointer d\'instructions vers le haut'],
    '5f': ['_', 'Pop', 'Supprimer le dessus de la pile'],
    '60': ['`', 'Start / end string literal', 'Commencer / finir un segment de texte et le mettre sur la pile'],
    '61': ['a', 'Pop a value off the stack and \'unshift\' it at the start of the U deque', 'pas encore documenté'],
    '62': ['b', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '63': ['c', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '64': ['d', 'Pop a value off the stack and \'unshift\' it at the start of the O deque', 'pas encore documenté'],
    '65': ['e', 'Pop a value off the stack and write it to the E register', 'Mettre la valeur du dessus de la pile dans le registre E'],
    '66': ['f', 'Fork - create a new thread. Push true on the parent thread\'s stack and false on the child thread\'s stack', 'Dupliquer cette partie du programme; mettre \'vrai\' sur la pile du parent et \'faux\' sur la pile de la copie'],
    '67': ['g', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '68': ['h', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '69': ['i', 'Pop a value off the stack and push it onto the I deque', 'pas encore documenté'],
    '6a': ['j', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '6b': ['k', 'Halt the current thread', 'Arrêter cette partie du programme'],
    '6c': ['l', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '6d': ['m', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '6e': ['n', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '6f': ['o', 'Pop a value off the stack and push it onto the O deque', 'pas encore documenté'],
    '70': ['p', 'Pop a value off the stack and \'unshift\' it at the start of the Y deque', 'pas encore documenté'],
    '71': ['q', 'Pop a value off the stack and write it to the Q register', 'Mettre la valeur du dessus de la pile dans le registre Q'],
    '72': ['r', 'Pop a value off the stack and write it to the R register', 'Mettre la valeur du dessus de la pile dans le registre R'],
    '73': ['s', 'Pop a value off the stack and \'unshift\' it at the start of the I deque', 'pas encore documenté'],
    '74': ['t', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '75': ['u', 'Pop a value off the stack and push it onto the U deque', 'pas encore documenté'],
    '76': ['v', 'IP v', 'Envoyer le pointeur d\'instructions vers le bas'],
    '77': ['w', 'Pop a value off the stack and write it to the W register', 'Mettre la valeur du dessus de la pile dans le registre W'],
    '78': ['x', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '79': ['y', 'Pop a value off the stack and push it onto the Y deque', 'pas encore documenté'],
    '7a': ['z', 'undocumented / not yet assigned', 'non documenté / pas encore assigné'],
    '7c': ['|', 'Mirror - inverse IP direction', 'Miroir - renvoyer le pointeur dans la direction opposée'],
    'a0': ['«', 'Lesser than', '<'],
    'a1': ['»', 'Greater than', '>'],
    'a2': ['≤', 'Lesser or equal', '≤'],
    'a3': ['≥', 'Greater or equal', '≥'],
    'ac': ['¬', 'Swap', 'Inverser l\'ordre des deux éléments du dessus de la pile'],
    'bf': ['¿', 'Unless - execute next unless pop() is truthy', 'L\'inverse de \'?\''],
};
function fillTextWithWordWrap(ctx, text, x, y, lineHeight, maxWidth) {
    maxWidth = maxWidth || 0;

    if (maxWidth <= 0) {
        ctx.fillText(text, x, y);
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var index = 1;
    while (words.length > 0 && index <= words.length) {
        var str = words.slice(0, index).join(' ');
        var w = ctx.measureText(str).width;
        if (w > maxWidth) {
            if (index == 1) {
                index = 2;
            }
            ctx.fillText(words.slice(0, index - 1).join(' '), x, y + (lineHeight * currentLine));
            currentLine++;
            words = words.splice(index - 1);
            index = 1;
        } else {
            index++;
        }
    }
    if (index > 0) {
        ctx.fillText(words.join(' '), x, y + (lineHeight * currentLine));
    }
}
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
                        fakeEvent(codePage[hex][0]);
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
            ctx.fillText('Q ' + thread.registers.q, 3 + i * 50, canvas.height - 280);
            ctx.fillText('W ' + thread.registers.w, 3 + i * 50, canvas.height - 260);
            ctx.fillText('E ' + thread.registers.e, 3 + i * 50, canvas.height - 240);
            ctx.fillText('R ' + thread.registers.r, 3 + i * 50, canvas.height - 220);
            for (let j = thread.stack.items.length - 1, k = 0; j >= 0; j--, k++) {
                ctx.fillText(`${j} ` + thread.stack.items[j], 3 + i * 50, canvas.height - 200 + (k + 1) * 20);
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
                    let hovering = inRect(mouseX, mouseY, canvas.width - 294 + i * 18, j * 18 + 36, 18, 18);
                    if (hovering) {
                        ctx.fillStyle = '#888';
                    } else {
                        ctx.fillStyle = '#aaa';
                    }
                    ctx.fillRect(canvas.width - 294 + i * 18, j * 18 + 36, 18, 18);
                    ctx.fillStyle = 'black';
                    ctx.fillText(codePage[hex][0], canvas.width - 294 + i * 18 + 3, j * 18 + 36 + 3);
                    if (hovering) {
                        fillTextWithWordWrap(ctx, codePage[hex][1] + ' --- ' + codePage[hex][2], canvas.width - 295, 19 * 18, 15, 290);
                    }
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
