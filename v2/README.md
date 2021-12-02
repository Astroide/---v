# <>^v Version 2
<>^v is a stack-based language that allows moving the instruction pointer in two dimensions. All commands except strings and numbers are one character long so that the program can easily be written to work in multiple directions.  

## Online Interpreter
[https://astroide.github.io/---v/v2/](https://astroide.github.io/---v/v2/)

## Commands:
In the "Python Equivalent" column, `dir` is the current movement per iteration of the instruction pointer, and `ip` is the instruction pointer.
| Command | Description | Python Equivalent |
|---------|-------------|-------------------|
| `>` | Send instruction pointer rightwards | `dir = [1, 0]` |
| `<` | Send instruction pointer leftwards | `dir = [-1, 0]` |
| `^` | Send instruction pointer upwards | `dir = [0, -1]` |
| `v` | Send instruction pointer downwards | `dir = [0, 1]` |
| `L` | Loop: if the instruction pointer goes outside the code the next iteration, wrap around to the other side | `if ip[0] < 0: ip[0] = len(code) - 1`, `if ip[1] < 0: ip[1] = len(code[ip[1]]) - 1` and `ip[0] %= len(code); ip[1] %= len(code[ip[0]])` |
| `|` | Mirror: inverse IP direction | `dir = [-dir[0], -dir[1]]` |
| `,` | Pop stack and print with a newline | `print(pop())` |
| `[0123456789.]` | Number literals, can be altered by `<>^v` IP instructions | `push(<number>)` |
| `` `text` `` | String literals, can be altered by `<>^v` IP instructions | `push(<string>)` |

## Code Page
`□` represents not yet assigned spaces.
| hex1 / hex2 | `_0` | `_1` | `_2` | `_3` | `_4` | `_5` | `_6` | `_7` | `_8` | `_9` | `_A` | `_B` | `_C` | `_D` | `_E` | `_F` |
|-------------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|
| `0_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `1_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `2_`        | ` `  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `.`  | `□`  |
| `3_`        | `0`  | `1`  | `2`  | `3`  | `4`  | `5`  | `6`  | `7`  | `8`  | `9`  | `□`  | `□`  | `<`  | `□`  | `>`  | `□`  |
| `4_`        | `□`  | `A`  | `B`  | `C`  | `D`  | `E`  | `F`  | `G`  | `H`  | `I`  | `J`  | `K`  | `L`  | `M`  | `N`  | `O`  |
| `5_`        | `P`  | `Q`  | `R`  | `S`  | `T`  | `U`  | `V`  | `W`  | `X`  | `Y`  | `Z`  | `□`  | `□`  | `□`  | `^`  | `□`  |
| `6_`        | `□`  | `a`  | `b`  | `c`  | `d`  | `e`  | `f`  | `g`  | `h`  | `i`  | `j`  | `k`  | `l`  | `m`  | `n`  | `o`  |
| `7_`        | `p`  | `q`  | `r`  | `s`  | `y`  | `u`  | `v`  | `w`  | `x`  | `y`  | `z`  | `□`  | `|`  | `□`  | `□`  | `□`  |
| `8_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `9_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `A_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `B_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `C_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `D_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `E_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |
| `F_`        | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  | `□`  |