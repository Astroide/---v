const express = require('express');
const { Server } = require('ws');
const { spawn: exec } = require('child_process');
const Database = require('./db');
const { basename, dirname } = require('path');
const { writeFile, unlink } = require('fs');
const wsServer = new Server({ noServer: true });
const app = express();
app.use(express.json());
const db = new Database();
const { createHash } = require('crypto');
function hash(value) {
    let hasher = createHash('sha256');
    hasher.update(value);
    return hasher.digest('hex').toString();
}
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
});
app.post('/upload', (req, res) => {
    const content = req.body.payload;
    console.log(content, req.body);
    const hashedValue = hash(content);
    db.setKey(hashedValue, content);
    res.status(200).end(JSON.stringify({ "id": hashedValue }));
});
app.post('/get', (req, res) => {
    res.status(200).end(JSON.stringify({ "content": db.getKey(req.body.id) }));
});
wsServer.on('connection', socket => {
    socket.on('message', json => {
        const { id, input } = JSON.parse(json);
        const content = db.getKey(id);
        console.log(id, db.contents);
        if (content === undefined) {
            socket.send(JSON.stringify({ "type": "error", "info": "Not Found" }));
            return;
        }
        const filename = `tmp_${Date.now()}.udlr`;
        const filePath = `${__dirname}/tmp/${filename}`;
        const inputFilePath = `${filePath}.input`
        writeFile(inputFilePath, input, () => {
            writeFile(filePath, content, () => {
                console.log(filePath);
                const childProcess = exec(`cat ${inputFilePath} | python3 ${dirname(__dirname)}/udlr.py ${filePath}`, { shell: true });
                socket.send(JSON.stringify({ "type": "ok" }));
                socket.on('close', () => {
                    if (!childProcess.killed) childProcess.kill();
                    console.log(`socket closed, killing...`)
                });
                if (socket.readyState == socket.CLOSED) {
                    if (!childProcess.killed) childProcess.kill();
                    return;
                }
                childProcess.stdout.on('data', data => {
                    socket.send(JSON.stringify({ "type": "data", "content": data.toString('utf8') }))
                });
                childProcess.on('exit', () => {
                    childProcess.didExit = true;
                    socket.send(JSON.stringify({ "type": childProcess.didExitByTimeout ? "timeout" : "end" }));
                    unlink(filePath, () => {
                        console.log(`destroyed temporary file ${filename}`);
                    });
                    unlink(inputFilePath, () => {
                        console.log(`destroyed temporary file ${filename}.input`);
                    });
                });
                setTimeout(() => {
                    if (!childProcess.killed && !childProcess.didExit) {
                        console.log('child process took more than 1 min to execute, killing...');
                        childProcess.didExitByTimeout = true;
                        childProcess.kill();
                    }
                }, 60000);
            });
        });
    });
});
const rawServer = app.listen(9000);
rawServer.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});