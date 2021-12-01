const transpose = array => array[0].map((_, colIndex) => array.map(row => row[colIndex]));
function fixCode(code) {
    console.log(code);
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
    console.log(code);
    return code;
}
/** @type {string[][]} */
let code = fixCode(transpose(
(
`
>v>v>v
 dddd,
 aaaa
 tttt
 aaaa
\`>^>^
^    <
`
).slice(1).split('\n').map(x => x.split(''))
));

const controlCharacters = '<>^v';

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.length > 0 ? this.items.pop() : 0;
    }

    toString() {
        return `[${this.items.map(x => {
            if (typeof x == 'string') {
                return '`' + x + '`';
            }
            return x;
        }).join(' ')}]`;
    }
}

class Thread {
    /**
     * @param {number[]} ip
     * @param {string[][]} code
     */
    constructor(ip = [0, 0], code) {
        this.ip = ip;
        this.direction = [1, 0];
        this.code = code;
        this.stack = new Stack();
        this.dead = false;
        /** @type {'number' | 'string'} */
        this.currentLiteralType = '';
        this.isInLiteral = false;
        this.literal = '';
        this.backslash = false;
    }

    update() {
        this.ip[0] += this.direction[0];
        this.ip[1] += this.direction[1];
        if (this.ip[0] < 0) {
            this.ip[0] = code.length - 1;
        }
        if (this.ip[0] >= code.length) {
            this.ip[0] = 0;
        }
        if (this.ip[1] < 0) {
            this.ip[1] = code[0].length - 1;
        }
        if (this.ip[1] >= code[0].length) {
            this.ip[1] = 0;
        }
        // console.log(this.code[this.ip[0]][this.ip[1]] + ' | ' + this.ip[0] + ', ' + this.ip[1] + ' | ' + this.direction[0] + ', ' + this.direction[1] + ' | ' + this.stack.toString());
        let c = this.code[this.ip[0]][this.ip[1]];
        if (this.backslash && this.currentLiteralType == "string") {
            if (c === '`') {
                this.literal += '`';
            } else if (c == 'n') {
                this.literal += '\n';
            } else {
                this.literal += c;
            }
            this.backslash = false;
        } else {
            if (c === '>') {
                this.direction = [1, 0];
            } else if (c === '<') {
                this.direction = [-1, 0];
            } else if (c === '^') {
                this.direction = [0, -1];
            } else if (c === 'v') {
                this.direction = [0, 1];
            } else {
                if (this.isInLiteral && this.currentLiteralType == "string") {
                    if (c === '`') {
                        this.stack.push(this.literal);
                        this.isInLiteral = false;
                    } else if (c === '\\') {
                        this.backslash = true;
                    } else {
                        this.literal += c;
                    }
                } else {
                    if (this.isInLiteral && this.currentLiteralType == 'number' && !/\d|\./.test(c)) {
                        this.stack.push(parseFloat(this.literal));
                        this.isInLiteral = false;
                    }
                    if (c === '`') {
                        this.isInLiteral = true;
                        this.currentLiteralType = 'string';
                        this.literal = '';
                    } else if (/\d|\./.test(c)) {
                        if (!this.isInLiteral) {
                            this.isInLiteral = true;
                            this.currentLiteralType = 'number';
                            this.literal = c;
                        } else {
                            this.literal += c;
                        }
                    } else if (c === ',') {
                        console.log(this.stack.pop());
                    }
                }
            }
        }
    }
}

function run() {
    let threads = [new Thread([0, 0], code)];
    setInterval(() => {
        for (let i = 0; i < threads.length; i++) {
            const thread = threads[i];
            thread.update();
            if (thread.dead) {
                threads.splice(i, 1);
                i--;
            }
        }
    }, 100);
}

run();