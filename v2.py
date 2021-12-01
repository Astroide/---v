#!/usr/bin/env python3
import sys
from typing import Tuple

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

def fatal_error(message):
    eprint(f'Fatal error: {message}')
    exit()

control_flow = '<>^v|⟗⩟'
env = {}
arguments = sys.argv[1:]
debug = '--debug' in sys.argv

if debug:
    arguments.remove('--debug')

try:
    filename = arguments[0]
except IndexError:
    eprint('A filename must be passed')
    exit()

try:
    with open(filename, 'r') as filestream:
        contents = filestream.read()
except FileNotFoundError:
    fatal_error(f'The file {filename} does not exist (which implies, quite obviously, that it cannot be read and therefore cannot be executed).')
except PermissionError:
    fatal_error(f"It seems you've not given this program enough permissions to access the file {filename}. If you want to be able to run that file, you should allow the interpreter to access it !")

instructions = list(map(list, contents.split('\n')))
# instructions = list(map(list, zip(*instructions)))
ip = (0, 0) # Instruction pointer
direction = (1, 0)

def get() -> str:
    global instructions, ip
    return instructions[ip[0]][ip[1]]

def move():
    global ip, direction
    ip[0] += direction[0]
    ip[1] += direction[1]

def move_by(x, y):
    global ip
    ip[0] += x
    ip[1] += y

def out():
    global ip, instructions
    return ip[0] < 0 or ip[0] >= len(instructions) or ip[1] < 0 or ip[1] > len(instructions[ip[0]])

class Stack:
    def __init__(self):
        self.stack = []
    
    def pop(self):
        if len(self.stack) == 0:
            return 0
        else:
            return self.stack.pop()
    
    def push(self, value):
        self.stack.append(value)

class CallFrame:
    def __init__(self, original_ip, original_direction, original_stack):
        self.ip = original_ip
        self.direction = original_direction
        self.stack = original_stack

class Function:
    def __init__(self, start_ip, arity):
        self.ip = start_ip
        self.arity = arity
    
    def call(self, ip, direction):
        pass

main_stack = Stack()
current_stack = main_stack

while True:
    instruction = get()
    move()
    if out():
        if instruction == '⟗':
            if ip[0] < 0:
                ip[0] = len(instructions) - 1
            if ip[0] >= len(instructions):
                ip[0] = 0
            if ip[1] < 0:
                ip[1] = len(instructions[ip[0]]) - 1
            if ip[1] >= len(instructions[ip[0]]):
                ip[1] = 0