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

    get length() {
        return this.items.length;
    }
}
function equals(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.every((value, index) => equals(value, b[index]));
    } else if (typeof a !== typeof b) {
        return false;
    } else if (typeof a === 'number') {
        return a === b;
    } else if (typeof a === 'string') {
        return a === b;
    } else if (typeof a == 'object') {
        return Object.keys(a).every(name => {
            return name in b && equals(a[name], b[name]);
        }) && Object.keys(b).every(name => {
            return name in a && equals(b[name], a[name]);
        });
    } else if (typeof a == 'function') {
        return a.toString() === b.toString();
    } else {
        return a === b;
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
        this.registers = {
          q: 0,
          w: 0,
          e: 0,
          r: 0
        };
        this.deques = {
          y: [],
          u: [],
          i: [],
          o: []
        }
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
        if (this.ip[0] < 0) {
            if (this.last == 'L') {
                this.ip[0] = this.code.length - 1;
            } else {
                // console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                this.dead = true;
                return;
            }
        }
        if (this.ip[0] >= this.code.length) {
            if (this.last == 'L') {
                this.ip[0] = 0;
            } else {
                // console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                this.dead = true;
                return;
            }
        }
        if (this.ip[1] < 0) {
            if (this.last == 'L') {
                this.ip[1] = this.code[0].length - 1;
            } else {
                // console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                this.dead = true;
                return;
            }
        }
        if (this.ip[1] >= this.code[0].length) {
            if (this.last == 'L') {
                this.ip[1] = 0;
            } else {
                // console.log('DIE ' + this.ip + ' ' + this.code.length + ',' + this.code[0].length);
                this.dead = true;
                return;
            }
        }
        this.history.unshift([this.ip[0], this.ip[1]]);
        if (this.history.length > 80) {
            this.history.pop();
        }
        // console.log('#' + this.runner.threads.indexOf(this) + ' | [' + /*this.code[this.ip[0]][this.ip[1]] +*/ '] | (' + this.ip[0] + ', ' + this.ip[1] + ') | {' + this.direction[0] + ', ' + this.direction[1] + '} | stack ' + this.stack.toString());
        if (this.skip) {
            this.skip = false;
            return;
        }
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
                        this.runner.write(this.toString(this.stack.pop()) + '\n');
                    } else if (c === ';') {
                        let e = this.stack.pop();
                        this.runner.write(this.toString(e) + '\n');
                        this.stack.push(e);
                    } else if (c === 'f') {
                        this.runner.threads.push(new Thread([this.ip[0], this.ip[1]], this.code, this.runner));
                        this.runner.threads[this.runner.threads.length - 1].brandNew = true;
                        this.runner.threads[this.runner.threads.length - 1].direction = [this.direction[0], this.direction[1]];
                        for (let i = 0; i < this.stack.length; i++) {
                            this.runner.threads[this.runner.threads.length - 1].stack.push(this.stack.items[i]);
                        }
                        this.runner.threads[this.runner.threads.length - 1].registers.q = this.registers.q;
                        this.runner.threads[this.runner.threads.length - 1].registers.w = this.registers.w;
                        this.runner.threads[this.runner.threads.length - 1].registers.e = this.registers.e;
                        this.runner.threads[this.runner.threads.length - 1].registers.r = this.registers.r;
                        this.runner.threads[this.runner.threads.length - 1].deques.y = this.deques.y.map(x => x);
                        this.runner.threads[this.runner.threads.length - 1].deques.u = this.deques.u.map(x => x);
                        this.runner.threads[this.runner.threads.length - 1].deques.i = this.deques.i.map(x => x);
                        this.runner.threads[this.runner.threads.length - 1].deques.o = this.deques.o.map(x => x);
                        this.stack.push(true);
                        this.runner.threads[this.runner.threads.length - 1].stack.push(false);
                    } else if (c === 'k') {
                        this.dead = true;
                    } else if (c === '|') {
                        this.direction = [-this.direction[0], -this.direction[1]];
                    } else if (c === '+') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        this.stack.push(left + right);
                    } else if (c === '-') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        if (typeof left === 'number' && typeof right === 'number') {
                            this.stack.push(left - right);
                        } else if (typeof left === 'string' && typeof right === 'string') {
                            this.stack.push(left.replace(new RegExp(right, 'g'), ''));
                        }
                    } else if (c === '*') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        if (typeof left === 'number' && typeof right === 'number') {
                            this.stack.push(left * right);
                        } else if (typeof left === 'string' && typeof right === 'number') {
                            let s = '';
                            for (let i = 0; i < right; i++) {
                                s += left;
                            }
                            this.stack.push(s);
                        }
                    } else if (c === '/') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        if (typeof left === 'number' && typeof right === 'number') {
                            this.stack.push(left / right);
                        } else if (typeof left === 'string' && typeof right === 'number') {
                            let parts = [];
                            let x = left.length;
                            x /= right;
                            x = Math.floor(x);
                            let q = 0;
                            while (left.length > q) {
                                parts.push(left.substring(q, q + right));
                                q += right;
                            }
                            this.stack.push(parts);
                        }
                    } else if (c === '%') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        if (typeof left === 'number' && typeof right === 'number') {
                            this.stack.push(left % right);
                        } else if (typeof left === 'string' && typeof right === 'number') {
                            let parts = [];
                            let i = 0;
                            while (i + right < left.length) {
                                parts.push(left.substring(i, i + right));
                                i += right;
                            }
                            parts.push(left.substring(i));
                            this.stack.push(parts);
                        }
                    } else if (c === ':') {
                        let e = this.stack.pop();
                        this.stack.push(e);
                        this.stack.push(e);
                    } else if (c === '_') {
                        this.stack.pop();
                    } else if (c === 'T') {
                        this.stack.push(true);
                    } else if (c === 'F') {
                        this.stack.push(false);
                    } else if (c === '?') {
                        let value = this.stack.pop();
                        if (!value) {
                            this.skip = true;
                        }
                    } else if (c === '¿') {
                        let value = this.stack.pop();
                        if (value) {
                            this.skip = true;
                        }
                    } else if (c === '¬') {
                      let a = this.stack.pop();
                      let b = this.stack.pop();
                      this.stack.push(a);
                      this.stack.push(b);
                    } else if (c === '!') {
                        this.stack.push(!this.stack.pop());
                    } else if (c === '#') {
                        this.skip = true;
                    } else if (c === '=') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        this.stack.push(equals(left, right));
                    } else if (c === '«') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        this.stack.push(left < right);
                    } else if (c === '»') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        this.stack.push(left > right);
                    } else if (c === '≤') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        this.stack.push(left <= right);
                    } else if (c === '≥') {
                        let right = this.stack.pop();
                        let left = this.stack.pop();
                        this.stack.push(left >= right);
                    } else if (c === 'q' || c === 'w' || c === 'e' || c === 'r') {
                      this.registers[c] = this.stack.pop();
                    } else if (c === 'Q' || c === 'W' || c === 'E' || c === 'R') {
                      this.stack.push(this.registers[c.toLowerCase()]);
                    } else if (c === 'y') {
                      this.deques.y.push(this.stack.pop());
                    } else if (c === 'u') {
                      this.deques.u.push(this.stack.pop());
                    } else if (c === 'i') {
                      this.deques.i.push(this.stack.pop());
                    } else if (c === 'o') {
                      this.deques.o.push(this.stack.pop());
                    } else if (c === 'Y') {
                      this.stack.push(this.deques.y.pop());
                    } else if (c === 'U') {
                      this.stack.push(this.deques.u.pop());
                    } else if (c === 'I') {
                      this.stack.push(this.deques.i.pop());
                    } else if (c === 'O') {
                      this.stack.push(this.deques.o.pop());
                    } else if (c === 'p') {
                      this.deques.y.unshift(this.stack.pop());
                      console.log(this.deques.y);
                    } else if (c === 'a') {
                      this.deques.u.unshift(this.stack.pop());
                    } else if (c === 's') {
                      this.deques.i.unshift(this.stack.pop());
                    } else if (c === 'd') {
                      this.deques.o.unshift(this.stack.pop());
                    } else if (c === 'P') {
                      this.stack.push(this.deques.y.shift());
                    } else if (c === 'A') {
                      this.stack.push(this.deques.u.shift());
                    } else if (c === 'S') {
                      this.stack.push(this.deques.i.shift());
                    } else if (c === 'D') {
                      this.stack.push(this.deques.o.shift());
                    }
                }
            }
            this.last = this.code[this.ip[0]][this.ip[1]];
        }
    }

    toString(x) {
        if (typeof x === 'number') {
            return x.toString();
        }
        if (typeof x === 'string') {
            return x;
        }
        if (Array.isArray(x)) {
            return '[' + x.map(this.toString, this).join(', ') + ']';
        }
        if (typeof x === 'boolean') {
            return x ? 'true' : 'false';
        }
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
            if (!thread.brandNew) {
              thread.update();
            } else {
              thread.brandNew = false;
            }
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
