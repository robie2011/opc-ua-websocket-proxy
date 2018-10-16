var opcua = require("node-opcua");
var async = require("async");
const client = new opcua.OPCUAClient();
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

//const endpointUrl = "opc.tcp://opcuaserver.com:48010";

let session;
let init = endpointUrl => async.series([

    // step 1 : connect to
    function (callback) {
        client.connect(endpointUrl, function (err) {
            if (err) {
                console.log(" cannot connect to endpoint :", endpointUrl);
            } else {
                console.log("connected ! " + endpointUrl);
            }
            callback(err);
        });
    },

    // step 2 : createSession
    function (callback) {
        client.createSession(function (err, s) {
            if (!err) {
                session = s;
            }
            callback(err);
        });
    }
],
    function (err) {
        if (err) {
            console.log(" failure ", err);
        } else {
            //console.log("done!");
        }
        //client.disconnect(function () { });
    });


// step 3: install a subscription and install a monitored item for 10 seconds
let monitorNodes = function (nodes, onDataChange) {
    let subscription = new opcua.ClientSubscription(session, subscriptionConfig);

    subscription.on("started", function () {
        console.log("subscription started for subscriptionId=", subscription.subscriptionId);
    }).on("keepalive", function () {
        console.log("keepalive");
    }).on("terminated", function () {
    });

    // install monitored item
    nodes.forEach(n => {
        var monitoredItem = subscription.monitor({
            nodeId: opcua.resolveNodeId(n),
            attributeId: opcua.AttributeIds.Value
        },
            monitoredItemConfig,
            opcua.read_service.TimestampsToReturn.Both
        );
        console.log("-------------------------------------");

        monitoredItem.on("changed", onDataChange);
    });

    return subscription;
}

module.exports = {
    init,
    monitorNodes,

    // todo: save all subscriptions in an array and iterate over it for termination
    // note: session is lazy init
    //close: () => session.close(),

    terminateSubscription: subscription => {
        console.info("terminating subscription: " + subscription);
        subscription.terminate();
    }
}