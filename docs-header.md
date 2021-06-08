# <>^v
<>^v is a stack-based language that allows moving the instruction pointer in two dimensions.

The instruction pointer by default starts at (0, 0) and goes towards the right. The program is halted when the instruction pointer gets to the end of a line or column or when it encounters a `!`.

There is an integrated (very basic) turtle support. Supported commands are forward, backward, turn left, turn right, set speed, toggle turtle visibility, set window title, toggle pen (up / down) and handling of keyboard arrows via GOTOs.

When using turtle with event handling, you should (after executing program tasks and at the end of event handlers) send the program into an infinite loop to prevent it from exiting.

Number and strings can be written in *any* of the four directions. For example, the string `sometext` can be written this way :
```
"
s
o
m
e
t
e
x
t
"
```
and it will be interpreted correctly (as "sometext") only if the instruction pointer comes from the bottom and goes up.

## Examples

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
5∑          ^
0 10-æ      ^
5ß          ^
0 10-ª      ^
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
