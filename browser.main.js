// https://websocket.org/echo.html
let websocket = new WebSocket("ws://localhost:8080")
let metricOutput = document.getElementById("metric");
let logOutput = document.getElementById("log");
let logs = [];
let writeLog = (msg, topic = "common") => {
    return ;
    let d = new Date();
    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    let txt = `${d.toLocaleTimeString()} [${topic}] ${msg}\r\n${logOutput.innerText}`;
    logs.unshift(txt);
    //logs = logs.slice(0, Math.min(10, logs.length));
    logOutput.innerText =  logs.join("\r\n");
}

let client1 = null;
websocket.onopen = function (evt) {
    document.getElementById('online-badge').style.display = 'inline';
    document.getElementById('offline-badge').style.display = 'none';
    updateOpcNodeListener();
};
websocket.onclose = () => {
    document.getElementById('online-badge').style.display = 'none';
    document.getElementById('offline-badge').style.display = 'inline';
}

websocket.onmessage = msg => {
    metricOutput.innerText = msg.data;
    writeLog(msg.data, "onmessage");
}
websocket.onerror = console.error;

function updateOpcNodeListener() {
    let config = document.getElementById("nodeIds").value;
    config = config.replace(/\r/g, "");
    config = config.split("\n");

    writeLog(config, "config update");
    websocket.send(JSON.stringify({
        nodes: config
    }));

}