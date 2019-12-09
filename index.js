const express = require('express');
const bodyParser = require("body-parser");
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const Console = require('./ArtNetConsole');
const Slave = require('./ArtNetSlave');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

let slaves = [];

let status = { "status": "Online", "packets": { "send": 0, "received": 0 } }

server.on('error', (err) => {
    Console.error(`Server Error: \n${err.stack}`, 'udp4');
    status.status = "Offline";
    server.close();
});

server.on('close', () => {
    status.status = "Offline";
    Console.info('Server closed.', 'udp4');
});

server.on('message', (msg, info) => {
    /*
        Message for registering:
            { "message": "artnet_broadcast", "type:": "light" }
        
        Message for sending data:
            { 
                "message": "send",
                "data": { 
                    "channel": 1, "value": 255, "blackout": false, "fullOn": false
                }
            }
    */
    let object = JSON.parse(Buffer.from(msg));

    if(object.message === "artnet_broadcast") {
        server.send(Buffer.from('{ "connected": true, "message": "Connected to Artnet!" }'), info.port, info.address);
        slaves.push(new Slave(info.address, info.port, object.type));
    } else if(object.message === "send") {
        for(let i = 0; i < slaves.length; i++) {
            Console.info('Debug (Received): [Ch] ' + object.data.channel + ' [Val] ' + object.data.value, 'udp4');
            server.send(Buffer.from(JSON.stringify(object.data)), slaves[i].port, slaves[i].ipAdress);
        }
    }
});

server.on('listening', () => {
    Console.info(`Server listening on ${server.address().port}`, 'udp4');
    server.setBroadcast(true);
});

app.get('/', function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(status));
});

app.post('/send', function (req, res) {
    //Object { channel: 1, value: 255, blackout: false, fullOn: false }
    //JSON   { "channel": 1, "value": 255, "blackout": false, "fullOn": false }
    let body = req.body;
    let send = new Uint8Array([body.value]);
    Console.info('Debug (Received): [Ch] ' + body.channel + ' [Val] ' + body.value, 'rest');
    for(let i = 1; i < slaves.length; i++) {
        server.send(Buffer.from(send), 9050, slaves[i]);
    } 
    status.packets.send++;
    res.send('sended to artnet');
});
app.listen(9051);
Console.info('Service listening on 9051', 'rest')

server.bind(9050, "192.168.178.11");