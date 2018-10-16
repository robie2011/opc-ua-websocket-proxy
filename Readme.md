# OPC UA Websocket Proxy Demo
This project demonstrate how a browser can subscribe to OPC UA Nodes and receive updates in near realtime.

## Screenshot
![alt](http://g.recordit.co/3SAPIT21Kk.gif)

## Starting
```bash
cd /repos/
git clone https://github.com/robie2011/opc-ua-websocket-proxy.git
cd opc-ua-websocket-proxy
npm install

# starting websocket server on :8080
node server.js

# open index.html with your browser
# /repos/opc-ua-websocket-proxy/index.html
```

## Configurations
opc ua demo server: opc.tcp://opcuaserver.com:48010

In `server.opc-client.js` you can setup `samplingInterval`, `requestedPublishingInterval` and other subscription related configurations.

```javascript
const subscriptionConfig = {
    requestedPublishingInterval: 100,
    requestedLifetimeCount: 10,
    requestedMaxKeepAliveCount: 2,
    maxNotificationsPerPublish: 10,
    publishingEnabled: true,
    priority: 10
};
const monitoredItemConfig = {
    samplingInterval: 1,
    discardOldest: true,
    queueSize: 10
};
```