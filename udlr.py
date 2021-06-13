#!/usr/bin/env python3
import math
import os
import random
import sys
import time
import turtle  # import the mighty turtle


class MeaninglessException(BaseException):
    pass


filename = sys.argv[1]
debug = len(sys.argv) == 3 and sys.argv[2] == "--debug"
cursor_initial = False
cursor_start = (0, 0)
break_loop = False
if len(sys.argv) == 3 and sys.argv[2].startswith("--xy="):
    xy = sys.argv[2].lstrip('-xy=').split(',')
    cursor_initial = True
    cursor_start = (int(xy[0]), int(xy[1]))
handlers = {
    "Up": lambda x: x,
    "Down": lambda x: x,
    "Left": lambda x: x,
    "Right": lambda x: x
}


def handler_up(*args):
    handlers["Up"](0)


def handler_down(*args):
    handlers["Down"](0)


def handler_left(*args):
    handlers["Left"](0)


def handler_right(*args):
    handlers["Right"](0)


with open(filename, mode='r') as file:
    file_data = file.read().split('\n')
    content = [[j for j in i] for i in file_data]
    pointer_position = [0, 0]
    for a, i in enumerate(content):
        for b, j in enumerate(i):
            if j == '@':
                pointer_position[0] = a
                pointer_position[1] = b
    # print(pointer_position)
    if cursor_initial:
        pointer_position = [cursor_start[0], cursor_start[1]]
    pointer_direction = [0, 1]
    stack = [0]
    env = {}

    def main_op():
        global pointer_direction, pointer_position, content, stack, env, break_loop
        instruction = content[pointer_position[0]][pointer_position[1]]
        if debug:
            print(instruction)
        once = True
        while once:
            once = False
            # print(instruction)
            if instruction.isnumeric():
                num = instruction
                pointer = [pointer_position[0], pointer_position[1]]
                while True:
                    pointer[0] += pointer_direction[0]
                    pointer[1] += pointer_direction[1]
                    if content[pointer[0]][pointer[1]].isnumeric():
                        num += content[pointer[0]
                                       ][pointer[1]]
                    else:
                        pointer_position = [
                            pointer[0] - pointer_direction[0], pointer[1] - pointer_direction[1]]
                        break
                num = int(num)
                stack.append(num)
                break
            elif instruction.isalpha() and not instruction == 'v' and ord(instruction) < ord('z') + 1:
                if instruction.islower():
                    env[instruction] = stack.pop()
                if instruction.isupper():
                    stack.append(env[instruction.lower()])
                break
            # match instruction:
            elif instruction == '<':
                if pointer_direction[1] == 1:
                    break
                pointer_direction[0] = 0
                pointer_direction[1] = -1
            elif instruction == '>':
                if pointer_direction[1] == -1:
                    break
                pointer_direction[0] = 0
                pointer_direction[1] = 1
            elif instruction == '^':
                if pointer_direction[0] == 1:
                    break
                pointer_direction[0] = -1
                pointer_direction[1] = 0
            elif instruction == 'v':
                if pointer_direction[0] == -1:
                    break
                pointer_direction[0] = 1
                pointer_direction[1] = 0
            elif instruction == '|':
                pointer_direction[0] = -pointer_direction[0]
                pointer_direction[1] = -pointer_direction[1]
            elif instruction == ';':
                if debug:
                    print('PRINT ', end='')
                print(str(stack[-1]))
            elif instruction == '~':
                if debug:
                    print('PRINT ', end='')
                print(str(stack[-1]), end='')
            elif instruction == '`':
                print()
            elif instruction == '!':
                exit()
            elif instruction == ')':
                stack[-1] += 1
            elif instruction == '(':
                stack[-1] -= 1
            elif instruction == '*':
                stack[-1] *= stack[-2]
            elif instruction == '⁄':
                stack[-1] = stack[-1] // stack[-2]
            elif instruction == '†':
                stack[-1] **= 2
            elif instruction == '√':
                stack[-1] = math.sqrt(stack[-1])
            elif instruction == '◊':
                stack[-1] = pow(stack[-1], stack[-2])
            elif instruction == '/':
                stack[-1] /= stack[-2]
            elif instruction == '+':
                stack[-1] += stack[-2]
            elif instruction == '$':
                stack[-1] = stack[-1] ** stack[-2]
            elif instruction == '-':
                stack[-1] -= stack[-2]
            elif instruction == '%':
                stack[-1] %= stack[-2]
            elif instruction == '‡':
                stack[-1] = str(stack[-1])
            elif instruction == '¥':
                stack[-2:] = stack[-2:][::-1]
                stack.pop()
            elif instruction == ',':
                if "ù" in env:
                    stack.append(int(input(env["ù"])))
                else:
                    stack.append(int(input('> ')))
            elif instruction == '.':
                if "ù" in env:
                    stack.append(input(env["ù"]))
                else:
                    stack.append(input('> '))
            elif instruction == '=':
                if stack[-1] == stack[-2]:
                    pass
                else:
                    pointer_position[0] += pointer_direction[0]
                    pointer_position[1] += pointer_direction[1]
            elif instruction == ':':
                if stack[-1] != stack[-2]:
                    pass
                else:
                    pointer_position[0] += pointer_direction[0]
                    pointer_position[1] += pointer_direction[1]
            elif instruction == '}' or instruction == '›':
                if stack[-1] > stack[-2]:
                    pass
                else:
                    pointer_position[0] += pointer_direction[0]
                    pointer_position[1] += pointer_direction[1]
            elif instruction == '{' or instruction == '‹':
                if stack[-1] < stack[-2]:
                    pass
                else:
                    pointer_position[0] += pointer_direction[0]
                    pointer_position[1] += pointer_direction[1]
            elif instruction == ']' or instruction == '≥':
                if stack[-1] >= stack[-2]:
                    pass
                else:
                    pointer_position[0] += pointer_direction[0]
                    pointer_position[1] += pointer_direction[1]
            elif instruction == '[' or instruction == '≤':
                if stack[-1] <= stack[-2]:
                    pass
                else:
                    pointer_position[0] += pointer_direction[0]
                    pointer_position[1] += pointer_direction[1]
            elif instruction == '…':
                stack[-1] = float(stack[-1])
            elif instruction == '?':
                stack[-2:] = stack[-2:][::-1]
            elif instruction == '_':
                stack.pop()
            elif instruction == '&':
                print(stack)
            elif instruction == '¬':
                print(env)
            elif instruction == '¿':
                stack.append(len(stack[-1]))
            elif instruction == '\\':
                if debug:
                    print('PRINT ', chr(stack[-1]), end="")
                else:
                    print(chr(stack[-1]), end="")
            elif instruction == '»':
                os.popen(
                    f"python3 {str(os.path.abspath(__file__))} {stack[-3]} --xy={stack[-1]},{stack[-2]}").read()
            elif instruction == '«':
                pointer_position = [stack[-1], stack[-2]]
            elif instruction == '®':
                stack[-1] = stack[-2][stack[-1]]
            elif instruction == '"':
                text = ""
                while True:
                    pointer_position[0] += pointer_direction[0]
                    pointer_position[1] += pointer_direction[1]
                    # print(pointer_position, pointer_direction,
                    #   content[pointer_position[0]][pointer_position[1]])
                    if content[pointer_position[0]][pointer_position[1]] == '"':
                        break
                    text += content[pointer_position[0]
                                    ][pointer_position[1]]
                stack.append(text)
            elif instruction == '∑':
                turtle.forward(stack[-1])
            elif instruction == 'ß':
                turtle.backward(stack[-1])
            elif instruction == 'æ':
                turtle.left(stack[-1])
            elif instruction == 'ª':
                turtle.right(stack[-1])
            elif instruction == 'œ':
                turtle.tracer(0, 0)
            elif instruction == '#':
                stack.append(random.randint(0, stack[-1]))
            elif instruction == 'Ω':
                stack.append(os.popen(f'curl -L {stack[-1]}').read())
            elif instruction == '•':
                stack.append(stack[-2].index(str(stack[-1])))
            elif instruction == '§':
                parts = []
                if stack[-2] == '':
                    parts = list(stack[-1])
                else:
                    parts = stack[-1].split(stack[-2])
                for part in parts:
                    stack.append(part)
                stack.append(len(parts))
            elif instruction == '—':
                stack[-1] = stack[-1][::-1]
            elif instruction == '≈':
                if type(stack[-1]) == float or type(stack[-1]) == int:
                    stack.append(stack[-1])
                elif type(stack[-1]) == str:
                    stack.append(stack[-1][::])
            elif instruction == '±':
                stack[-1] = -stack[-1]
            elif instruction == '¯':
                stack.append(stack[-1][stack[-2]:stack[-3]])
            elif instruction == '√':
                turtle.title(str(stack[-1]))
            elif instruction == 'ƒ':
                if turtle.isvisible():
                    turtle.hideturtle()
                else:
                    turtle.showturtle()
            elif instruction == '¢':
                turtle.listen()
                turtle.onkeypress(handler_up, 'Up')
                turtle.onkeypress(handler_down, 'Down')
                turtle.onkeypress(handler_left, 'Left')
                turtle.onkeypress(handler_right, 'Right')
                break_loop = True
            elif instruction == '¡':
                x = stack[-1]
                y = stack[-2]

                def fn(_):
                    global pointer_position, pointer_direction
                    pointer_position = [x, y]
                    pointer_direction = [0, 1]
                    # print(x, y, len(content),
                    #   pointer_direction, pointer_position, len(content[0]))
                handlers["Up"] = fn
            elif instruction == '£':
                x = stack[-1]
                y = stack[-2]

                def fn(_):
                    global pointer_direction, pointer_position
                    pointer_position = [x, y]
                    pointer_direction = [0, 1]
                handlers["Down"] = fn
            elif instruction == '€':
                x = stack[-1]
                y = stack[-2]

                def fn(_):
                    global pointer_direction, pointer_position
                    pointer_position = [x, y]
                    pointer_direction = [0, 1]
                handlers["Left"] = fn
            elif instruction == '∞':
                x = stack[-1]
                y = stack[-2]

                def fn(_):
                    global pointer_direction, pointer_position
                    pointer_position = [x, y]
                    pointer_direction = [0, 1]
                handlers["Right"] = fn
            elif instruction == '°':
                time.sleep(0.1)
            elif instruction == '∆':
                if turtle.isdown():
                    turtle.penup()
                else:
                    turtle.pendown()
            elif instruction == 'π':
                turtle.clearscreen()
                turtle.reset()
        pointer_position[0] += pointer_direction[0]
        pointer_position[1] += pointer_direction[1]
        if (pointer_position[0] >= len(content) or pointer_position[0] < 0 or pointer_position[1] >= len(content[pointer_position[0]]) or pointer_position[1] < 0):
            exit()
    while True:
        if not break_loop:
            main_op()
        else:
            def function():
                main_op()
                turtle.ontimer(function, 1)
            turtle.ontimer(function, 10)
            turtle.mainloop()
            break

# DOCUMENTATION #
# >       || instruction pointer right
# <       || instruction pointer left
# v       || instruction pointer down
# ^       || instruction pointer up
# |       || mirror - reverse instruction pointer
# !       || exit
# <num>   || push num to the stack
# ;       || print top of the stack
# &       || print stack
# ,       || input number and push to the stack
# .       || input string and push to the stack
# *       || multiply top element of the stack by second-top element of the stack
# /       || divide top element of the stack by second-top element of the stack
# +       || add top element of the stack to second-top element of the stack
# -       || substract second-top element of the stack to top element of the stack
# %       || modulo - set top of stack to [top of stack] % [second-top element of the stack]
# =       || if equal - skip next instruction if top two elements of the stack are not equal
# :       || if not equal skip next instruction if top two elements of the stack are equal
# }       || skip next instruction if top element of the stack is greater than second-top element of the stack
# {       || skip next instruction if top element of the stack is smaller than second-top element of the stack
# ]       || skip next instruction if top element of the stack is greater or equal to the second-top element of the stack
# [       || skip next instruction if top element of the stack is smaller or equal to the second-top element of the stack
# _       || pop stack
# <chr>   || pop stack and write to slot chr
# <CHR>   || push slot chr to stack
# \       || print ASCII char corresponding to top of stack
# ~       || print top of stack without newline
# ¬       || print variables
# "<STR>" || push string to stack
# )       || increment top of stack
# (       || decrement top of stack
# ~       || print top of stack without newline
# V       || throw error
# «       || goto y = top of stack x = second element of stack and set instruction pointer to default
# »       || run file - run file [third element of stack] with pointer starting at y [top of stack] x [second element of stack]
# ?       || swap top two elements of stack
# `       || print newline
# #       || push random number between 0 and [top of stack] to stack
# °       || wait for 0.1 second
# @       || instruction pointer will start here
# √       || set top of stack to square root of top of stack
# ◊       || set top of stack to [second element of stack]-th root of top of stack
# †       || set top of stack to [top of stack]^2 (shortcut for adding `2?^` or having 2 already on the stack and calling `^`)
# …       || convert top of stack to number
# ‹       || same as `{`
# ›       || same as `}`
# ≥       || same as `]`
# ≤       || same as `[`
# ⁄       || integer division (top of stack `//` second element of stack)
# ù       || special variable ; if set, the `,` and `.` commands will use its value as prompt
# §       || push to stack all elements of top of stack.split(second element of stack) and push number of elements
# ¯       || push to stack (top element of stack).substring(second element of stack, third element of stack)
# ±       || toggle sign of top of stack
# ≈       || duplicate top of stack
# Ω       || fetch url [top of stack] ; push page contents
# ‡       || top of stack = str(top of stack)
# ¥       || remove second element of stack, shortcut for `?_`
# •       || push index of [top of stack] in [second element of stack]
# ¿       || push length of top of stack
# —       || (not a minus) string reverse - reverse top of stack
# ®       || set top of stack to (get character (top of stack) of [second element of stack])
# ∑       || turtle - forward by [top of stack]
# ß       || turtle - backward by [top of stack]
# æ       || turtle - turn left [top of stack] degrees
# ª       || turtle - turn right [top of stack] degrees
# œ       || turtle - set speed to [top of stack]
# µ       || turtle - set window title to [top of stack]
# ƒ       || turtle - toggle turtle visibility
# ¢       || turtle - listen to events and set handlers for arrow keys
# ¡       || (inverted !) turtle - set up arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
# £       || turtle - set down arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
# €       || turtle - set left arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
# ∞       || turtle - set right arrow handler to (GOTO y [top of stack] x [second element of stack] ; reset instruction pointer direction to default)
# ∆       || turtle - raise or lower pen (toggle state)
# π       || turtle - reset screen and position
# ¶       || turtle - update screen (push updates to screen)
