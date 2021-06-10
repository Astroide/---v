# <>^v
<>^v is a stack-based language that allows moving the instruction pointer in two dimensions. All commands except strings and numbers are one character long so that the program can easily be written to work in multiple directions.

The instruction pointer by default starts at (0, 0) and goes towards the right. However, you can change its starting position by using the `@` character. The **last** `@` (left-to-right, then up-to-down, like reading direction) will be used to specify pointer position if there are more than one. The program is halted when the instruction pointer gets to the end of a line or column or when it encounters a `!`.

There is an integrated (very basic) turtle support. Supported commands are forward, backward, turn left, turn right, set speed, toggle turtle visibility, set window title, toggle pen (up / down) and handling of keyboard arrows via GOTOs.

When using turtle with event handling, you should (after executing program tasks and at the end of event handlers) send the program into an infinite loop to prevent it from exiting.

## Basics

The language is stack-based. The stack can grow very large (up to the Python implementation's maximum array length). There is also variable space, where you can store values in a way that will not be modified when pushing new values to the stack. Any character that is considered a letter except `v` (including letters with diacritics) can be used as variable name.

### Push a number to the stack

To push a number onto the stack, just write it. There is no maximum of leading zeroes. **Floating point number literals are not currently supported.**

### Push a string to the stack

To add a string to the stack, use "string".

### IMPORTANT : Number and strings can be written in *any* of the four directions.
Strings and numbers are read character by character by the instruction pointer, in the direction it is going. So `"woem"` can be interpreted as `meow` if the pointer is coming from the right.

### Controlling the instruction pointer

The instruction pointer has a direction, which is by default left to right. It can be changed by the following characters :
* `>` tells the pointer *go right*. It is ignored if the pointer is going left.
* `<` tells the pointer *go left*. It is ignored if the pointer is going right.
* `^` tells the pointer *go up*. It is ignored if the pointer is going down.
* `v` tells the pointer *go down*. It is ignored if the pointer is going up.
* `|` is a mirror. When reached, it inverts the pointer's direction.

### Control statements (or something like that)
* `=` is the equality operator. It only executes the character immediately after it if the top two elements of the stack ae equal.
* `‹` and `›` (or `{` and `}`) work like `=`, but it tests instead first element of the stack `‹` | `›` second element of the stack.
* `≤` and `≥` (or `[` and `]`) work like `‹` and `›`, but they test greater or equal or lesser or equal.

### Operators

* `*` sets the top of the stack to the top of the stack * second element of the stack
* `+` sets the top of the stack to the top of the stack + second element of the stack
* `-` sets the top of the stack to the top of the stack - second element of the stack
* `/` sets the top of the stack to the top of the stack / second element of the stack
* `⁄` sets the top of the stack rounded result of to the top of the stack / second element of the stack
## Warning : key event handlers support is not always working.

## Examples

#### Hello World
```
"Hello World!";
```

#### Infinite loop
```
>v
^<
```

#### Prime number tester (`prime.udlr`)

```
>,tTT2]!2i>IT%0=vIT[vv
ù                 > vv
"               I   TI
                T   ~)
>               =    i
r               > ^  v
e         ^          <
b                   v
m               ~   >" is "v
u               >" is not ">~"prime";
n
"
^@|
```

#### Event handling

This example allows the user to control the turtle via the arrow keys (`movement.udlr`).

```
1∑0 3¡_4€_5£_6∞¢v
            v<  <
            >^
5∑          ¶^
0 10-æ      ¶^
5ß          ¶^
0 10-ª      ¶^
```

## Interpreter usage

First, make `udlr.py` executable :
`chmod +x ./udlr.py`

Then, you can use it this way :
`./udlr.py filename.udlr`

On Windows (or if you do not want to `chmod +x` `udlr.py`) :
`python3 ./udlr.py filename.udlr`

An optional `--debug` argument can be passed to the interpreter *after* the file name.
`./udlr.py filename.udlr --debug`
If that argument is passed, all instructions will be printed when executed and prints to standard output will be prefixed by `PRINT `.

---
## Commands
