const programZone = document.getElementById("program");
var runtimeCode = [['']];
var editor = {
    code: [['']],
    currentCharacter: {
        x: 0,
        y: 0
    },
    currentDirection: {
        x: 0,
        y: 1
    }
};
function displayCode(code) {
    programZone.innerHTML = updateWhitespace(code).map((x, xc) => x.map((y, yc) => `<span id="c-${xc}-${yc}"${xc == editor.currentCharacter.x && yc == editor.currentCharacter.y ? ' class="current"' : ''}${xc == editor.currentCharacter.x + editor.currentDirection.x && yc == editor.currentCharacter.y + editor.currentDirection.y ? ' class="next"' : ''}>${y.replace(/&/g, '&amp;').replace(/ /g, '&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`).join('')).join('\n').replace(/\n/g, '<br>');
}
function updateWhitespace(code) {
    if (!code[code.length - 1].every(x => !x || x == ' '))
        code.push([]);
    var maxLength = Math.max(...code.map(x => x[x.length - 1] == ' ' ? x.length : x.length + 1));
    for (let i = 0; i < code.length; i++) {
        const line = code[i];
        if (line.length < maxLength) {
            line.push(...' '.repeat(maxLength - line.length).split(''));
        }
    }
    return code;
}
addEventListener('click', ({ target }) => {
    if (/^c-(\d+)-(\d+)$/.test(target.id)) {
        [editor.currentCharacter.x, editor.currentCharacter.y] = target.id.slice(2).split('-').map(x => parseInt(x));
        displayCode(editor.code);
    }
});
var settings = location.search.replace(/^\?/, '').split('&').map(part => part.split('=')).map(([key, value]) => [key, decodeURIComponent(value)]).reduce((object, [key, value]) => (object[key] = value, object), {});
if (settings['code']) {
    editor.code = settings['code'].split('\n').map(x => x.split(''));
}
displayCode(editor.code);
var isShiftPressed = false;
addEventListener('keydown', e => {
    if (e.key == 'ArrowLeft') {
        if (isShiftPressed) editor.currentDirection = { x: 0, y: -1 };
        else {
            if (editor.currentCharacter.y > 0) editor.currentCharacter.y--;
        }
    } else if (e.key == 'ArrowRight') {
        if (isShiftPressed) editor.currentDirection = { x: 0, y: 1 };
        else {
            if (editor.currentCharacter.y + 1 >= editor.code[editor.currentCharacter.x].length) editor.code[editor.currentCharacter.x].push(' ');
            editor.currentCharacter.y++;
        }
    } else if (e.key == 'ArrowUp') {
        if (isShiftPressed) editor.currentDirection = { x: -1, y: 0 };
        else {
            if (editor.currentCharacter.x >= 1) {
                if (editor.code[editor.currentCharacter.x - 1].length - 1 <= editor.currentCharacter.y) editor.code[editor.currentCharacter.x - 1].push(...' '.repeat(-((editor.code[editor.currentCharacter.x - 1].length - 1) - editor.currentCharacter.y)).split(''));
                editor.currentCharacter.x--;
            }
        }
    } else if (e.key == 'ArrowDown') {
        if (isShiftPressed) editor.currentDirection = { x: 1, y: 0 };
        else {
            if (editor.currentCharacter.x >= editor.code.length - 1) editor.code.push([]);
            if (editor.code[editor.currentCharacter.x + 1].length - 1 <= editor.currentCharacter.y) editor.code[editor.currentCharacter.x + 1].push(...' '.repeat(-((editor.code[editor.currentCharacter.x + 1].length - 1) - editor.currentCharacter.y)).split(''));
            editor.currentCharacter.x++;
        }
    } else if (e.key == 'Shift') {
        isShiftPressed = true;
    } else if (e.key.length == 1) {
        editor.code[editor.currentCharacter.x][editor.currentCharacter.y] = e.key;
        editor.code = updateWhitespace(editor.code);
        if (editor.currentDirection.x == 1 && editor.currentDirection.y == 0) {
            if (editor.currentCharacter.x >= editor.code.length - 1) editor.code.push([]);
            if (editor.code[editor.currentCharacter.x + 1].length - 1 <= editor.currentCharacter.y) editor.code[editor.currentCharacter.x + 1].push(...' '.repeat(-((editor.code[editor.currentCharacter.x + 1].length - 1) - editor.currentCharacter.y)).split(''));
        } else if (editor.currentDirection.y == 0) {
            if (editor.currentCharacter.x >= 1) {
                if (editor.code[editor.currentCharacter.x - 1].length - 1 <= editor.currentCharacter.y) editor.code[editor.currentCharacter.x - 1].push(...' '.repeat(-((editor.code[editor.currentCharacter.x - 1].length - 1) - editor.currentCharacter.y)).split(''));
            } else return void displayCode();
        } else if (editor.currentCharacter.y == 1) {
            if (editor.currentCharacter.y + 1 >= editor.code[editor.currentCharacter.x].length) editor.code[editor.currentCharacter.x].push(' ');
        } else {
            if (!(editor.currentCharacter.y > 0)) return void displayCode();
        }
        editor.currentCharacter.x += editor.currentDirection.x;
        editor.currentCharacter.y += editor.currentDirection.y;
    }
    displayCode(editor.code);
    // var currentCharacterElement = document.getElementById(`c-${editor.currentCharacter.x}-${editor.currentCharacter.y}`);
    // window.scrollTo({
        // left: currentCharacterElement.getBoundingClientRect().left,
        // top: currentCharacterElement.getBoundingClientRect().top,
        // behavior: "auto"
    // });
});
addEventListener('keyup', ({ key }) => { if (key == 'Shift') isShiftPressed = false; });

function run() {
    // RUNTIME
    class Stack {
        constructor() {
            this.stack = [];
        }
        push(value) {
            this.stack.push(value);
        }
        pop() {
            if (this.stack.length) {
                return this.stack.pop();
            } else return 0;
        }
    }
    let mainStack = new Stack();
    let currentStack = mainStack;
    let blockStack = new Stack();
}