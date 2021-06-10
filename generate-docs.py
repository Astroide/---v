#!/usr/bin/env python3
with open('README.md', mode='w') as file:
    with open('docs-header.md', mode='r') as header:
        file.write(header.read())
        file.write('\n')
    with open('udlr.py', mode='r') as udlr:
        lines = udlr.read().split('\n')
        index = lines.index('# DOCUMENTATION #')
        lines = lines[index+1:]
        file.write('\n| Command | Description |\n| --- | --- |\n')
        for line in lines:
            if(len(line) == 0):
                continue
            line = line[2:]
            part1 = line[:line.index("||")]
            if part1.startswith('|'):
                part1 = f'\\{part1}'
            line = f'| `{(part1 if not part1.startswith("`") else "` " + part1 + "`")}` | {line[line.index("||")+2:]} |'
            file.write(f'{line}\n')