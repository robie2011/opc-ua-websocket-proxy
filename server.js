const WebSocket = require('ws');
const opcClient = require('./server.opc-client');
const wss = new WebSocket.Server({ port: 8080 });
opcClient.init("opc.tcp://opcuaserver.com:48010");

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    if (ws.subscription) {
      opcClient.terminateSubscription(ws.subscription);
    }

    let obj = JSON.parse(data);
    let config = obj.nodes.filter(d => d);
    ws.subscription = opcClient.monitorNodes(config, dataValue => {
      ws.readyState == WebSocket.OPEN && ws.send(dataValue.value.value)
    })
  });
});

// cleaning deprecated subscription
setInterval(() => {
  wss.clients.forEach(ws => {
    ws.readyState !== WebSocket.OPEN 
    && ws.subscription 
    && opcClient.terminateSubscription();
  })
}, 1000);
