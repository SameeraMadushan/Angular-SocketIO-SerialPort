const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const port = process.env.PORT || 3030;
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://159.65.147.14:1883'); //methanta local host dapan AWS dala

var mosca = require('mosca');

var address = "159.65.147.14"

var settings = {
    bind_address: address,
    port: 1883
}

// var ascoltatore = {
//     //using ascoltatore
//     type: 'mongo',
//     url: 'mongodb://localhost:27017/mqtt',
//     pubsubCollection: 'ichair_data',
//     mongo: {}
// };

var mqttser = new mosca.Server(settings);

mqttser.on('ready', function () {
    console.log("MQTT Broker is ready!");
});


var DataFromArduino = "on";
var DataToWeb = "on";


//----------------------------------------------SERVER MANAGEMENT--------------------------------------------
///build path of the project
app.use(express.static(path.join(__dirname, 'dist')));

//redirect to index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


//--------------------------------------MQTT/SOCKET COMMUNICATION WITH BROWSER-------------------------------
const io = socketIO(server);

var LedStatus = 'OFF';
var mqttMessage = '';

//------subscribe to MQTT topic-----------
client.on('connect', function () {
    client.subscribe('outTopic');
    client.subscribe('outTopic2');
    client.publish('outTopic', 'Hello mqtt');
    client.publish('outTopic2', 'Hello mqtt2');
    // io.sockets.emit('getLedStatus', mqttMessage);
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    mqttMessage = message.toString();
    if (topic == "outTopic")
        io.sockets.emit('getLedStatus', mqttMessage);
    else if (topic == "outTopic2")
        io.sockets.emit('humidity', mqttMessage);

    // client.end()
})
//---------------------------------------

io.on('connection', (socket) => {
    console.log('Web page connected to socket connection!');

    //send incoming data from mqtt to web browser initially
    // socket.emit('getLedStatus', mqttMessage);

    //send incoming data from web browser to mqtt
    socket.on('setLedStatus', (data) => {
        client.publish('outTopic', data);
    });

    //print disconnected when web page closed
    socket.on('disconnect', () => {
        console.log('Web page disconnected!');
    });
});