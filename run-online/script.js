const textarea = document.getElementById('code');
const status = document.getElementById('status');
const input = document.getElementById('input');
const output = document.getElementById('output');
var didSave = false;
function load(id) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = e => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            textarea.value = result.content;
            console.log('ok');
            status.innerText = `[${Date.now()}] Finished loading`;
        }
    };
    xhr.open('POST', '/get', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ "id": id }));
    didSave = true;
}
if (location.hash && location.hash.slice(1)) {
    status.innerText = `[${Date.now()}] Loading...`;
    load(location.hash.slice(1));
}
function send() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = e => {
        console.log(xhr);
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            let url = location.origin + "/#" + result.id;
            console.log('ok');
            status.innerHTML = `[${Date.now()}] Finished uploading (URL is <a class="unique-url" href="${url}">${url}</a>)`;
            didSave = true;
        }
    };
    xhr.open('POST', '/upload', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ "payload": textarea.value }));
}
addEventListener('hashchange', () => {
    if (location.hash && location.hash.slice(1)) {
        status.innerText = `[${Date.now()}] Loading...`;
        load(location.hash.slice(1));
        didSave = true;
    }
});
textarea.addEventListener('input', () => {
    didSave = false;
})
function run() {
    if (!location.hash || !location.hash.slice(1) || !didSave) {
        status.innerHTML = `<span style="color:red;">[${Date.now()}] Error : please save and / or click on the link to the code</span>`;
        return;
    }
    output.innerText = '';
    status.innerText = `[${Date.now()}] Connecting to server...`;
    const socket = new WebSocket(location.origin.replace('http', 'ws'));
    socket.addEventListener('message', e => {
        const data = JSON.parse(e.data);
        if (data.type == "error") {
            status.innerText = `[${Date.now()}] Error : ${data.info}`;
        }else if (data.type == "ok") {
            status.innerText = `[${Date.now()}] Running...`;
        } else if (data.type == "end") {
            status.innerText = `[${Date.now()}] Done running`;
            output.innerHTML += `<strong>Script is done [${data.time}ms Server Time]</strong>`;
        } else if (data.type == "timeout") {
            status.innerText = `[${Date.now()}] Done running`;
            output.innerHTML += "<strong>Script was killed because it ran for more than 60s.</strong>";
        } else if (data.type == "data") {
            output.innerText += data.content;
        } else if (data.type == "stderr") {
            output.innerHTML += `<span style="color:red;">${data.content}</span>`;
        } else {
            console.log(data);
        }
    });
    socket.addEventListener('open', () => {
        socket.send(JSON.stringify({
            "id": location.hash.slice(1),
            "input": input.value
        }));
    });
}
if(location.search.startsWith('?i=')) {
    input.value = atob(location.search.slice(3));
}