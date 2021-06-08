#!/usr/bin/env python3
with open('README.md', mode='w') as file:
    with open('docs-header.md', mode='r') as header:
        file.write(header.read())
        file.write('\n')
    with open('udlr.py', mode='r') as udlr:
        lines = udlr.read().split('\n')
        index = lines.index('# DOCUMENTATION #')
        lines = lines[index+1:]
        for line in lines:
            if(len(line) == 0):
                continue
            line = line[2:]
            if line.startswith('>') or line.startswith('#'):
                pass
            line = f'`{line[:line.index("||")]}`{line[line.index("||")+2:]}'
            file.write(f'* {line}\n')