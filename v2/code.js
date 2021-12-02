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
let __ThreadID__ = 0;
class Thread {
    /**
     * @param {number[]} ip
     * @param {string[][]} code
     * @param {Runner} runner
     */
    constructor(ip = [0, 0], code, runner) {
        this.id = __ThreadID__++;
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
        this.runner = runner;
        this.history = [];
        this.last = '';
    }

    update() {
        this.ip[0] += this.direction[0];
        this.ip[1] += this.direction[1];
        if (this.last.length !== 0) {
            if (this.ip[0] < 0) {
                if (this.last == 'L') {
                    this.ip[0] = this.code.length - 1;
                } else {
                    console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                    this.dead = true;
                    return;
                }
            }
            if (this.ip[0] >= this.code.length) {
                if (this.last == 'L') {
                    this.ip[0] = 0;
                } else {
                    console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                    this.dead = true;
                    return;
                }
            }
            if (this.ip[1] < 0) {
                if (this.last == 'L') {
                    this.ip[1] = this.code[0].length - 1;
                } else {
                    console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                    this.dead = true;
                    return;
                }
            }
            if (this.ip[1] >= this.code[0].length) {
                if (this.last == 'L') {
                    this.ip[1] = 0;
                } else {
                    console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                    this.dead = true;
                    return;
                }
            }
        }
        this.history.unshift([this.ip[0], this.ip[1]]);
        if (this.history.length > 80) {
            this.history.pop();
        }
        console.log('#' + this.runner.threads.indexOf(this) + ' | [' + /*this.code[this.ip[0]][this.ip[1]] +*/ '] | (' + this.ip[0] + ', ' + this.ip[1] + ') | {' + this.direction[0] + ', ' + this.direction[1] + '} | stack ' + this.stack.toString());
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
                        this.runner.write(this.stack.pop() + '\n');
                    } else if (c === 'F') {
                        this.runner.threads.push(new Thread([this.ip[0], this.ip[1]], this.code, this.runner));
                    } else if (c === 'K') {
                        this.dead = true;
                    }
                }
            }
        }
        this.last = this.code[this.ip[0]][this.ip[1]];
    }
}

class Runner {
    constructor(code) {
        this.code = code;
        this.threads = [new Thread([-1, 0], this.code, this)];
        this.logs = [''];
    }

    runStep() {
        for (let i = 0; i < this.threads.length; i++) {
            const thread = this.threads[i];
            thread.update();
            if (thread.dead) {
                this.threads.splice(i, 1);
                i--;
            }
        }
    }

    write(text) {
        for (let i = 0; i < text.length; i++) {
            if (text[i] == '\n') {
                this.logs.push('');
            } else {
                this.logs[this.logs.length - 1] += text[i];
            }
        }
    }
}
