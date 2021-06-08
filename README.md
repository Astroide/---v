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

* `>       ` instruction pointer right
* `<       ` instruction pointer left
* `v       ` instruction pointer down
* `^       ` instruction pointer up
* `|       ` mirror - reverse instruction pointer
* `!       ` exit
* `<num>   ` push num to the stack
* `;       ` print top of the stack
* `&       ` print stack
* `,       ` input number and push to the stack
* `.       ` input string and push to the stack
* `*       ` multiply top element of the stack by second-top element of the stack
* `/       ` divide top element of the stack by second-top element of the stack
* `+       ` add top element of the stack to second-top element of the stack
* `-       ` substract second-top element of the stack to top element of the stack
* `%       ` modulo - set top of stack to [top of stack] % [second-top element of the stack]
* `=       ` if equal - skip next instruction if top two elements of the stack are not equal
* `:       ` if not equal skip next instruction if top two elements of the stack are equal
* `}       ` skip next instruction if top element of the stack is greater than second-top element of the stack
* `{       ` skip next instruction if top element of the stack is smaller than second-top element of the stack
* `]       ` skip next instruction if top element of the stack is greater or equal to the second-top element of the stack
* `[       ` skip next instruction if top element of the stack is smaller or equal to the second-top element of the stack
* `_       ` pop stack
* `<chr>   ` pop stack and write to slot chr
* `<CHR>   ` push slot chr to stack
* `\       ` print ASCII char corresponding to top of stack
* `~       ` print top of stack without newline
* `¬       ` print variables
* `"<STR>" ` push string to stack
* `)       ` increment top of stack
* `(       ` decrement top of stack
* `~       ` print top of stack without newline
* `V       ` throw error
* `«       ` goto y = top of stack x = second element of stack and set instruction pointer to default
* `»       ` run file - run file [third element of stack] with pointer starting at y [top of stack] x [second element of stack]
* `?       ` swap top two elements of stack
* ``       ` print newline
* `#       ` push random number between 0 and [top of stack] to stack
* `°       ` wait for 0.1 second
* `@       ` instruction pointer will start here
* `ù       ` special variable ; if set, the `,` and `.` commands will use its value as prompt
* `∑       ` turtle - forward by [top of stack]
* `ß       ` turtle - backward by [top of stack]
* `æ       ` turtle - turn left [top of stack] degrees
* `ª       ` turtle - turn right [top of stack] degrees
* `œ       ` turtle - set speed to [top of stack]
* `√       ` turtle - set window title to [top of stack]
* `ƒ       ` turtle - toggle turtle visibility
* `¢       ` turtle - listen to events and set handlers for arrow keys
* `¡       ` (inverted !) turtle - set up arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
* `£       ` turtle - set down arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
* `€       ` turtle - set left arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
* `∞       ` turtle - set right arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
* `∆       ` turtle - raise or lower pen (toggle state)
* `π       ` turtle - reset screen and position
* `¶       ` turtle - update screen (push updates to screen)
