# ArtNet Server
This is the Repository for the Server.

# Installation
```
npm install
```

# Run
Make sure you have at least Node v8.0.0 installed.
```
npm start
```

# API documentation
## REST API (HTTP Port: 9051)
| Route | HTTP Type | Description                                   | Usage                                                                                 |
|-------|-----------|-----------------------------------------------|---------------------------------------------------------------------------------------|
| /     | GET       | Shows status of the Server.                   | Response: ``` {"status": "Online", "packets": { "send": 0, "received": 0}} ```        |
| /send | POST      | Send ArtNet commands to every Slave connected | Post Body: ``` { "channel": 1, "value": 255, "blackout": false, "fullOn": false } ``` |

## UDP API (Port: 9050)
| Command          | Description            | Usage                                                                                                             | Response                                                         |
|------------------|------------------------|-------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| artnet_broadcast | Register in the Artnet | ``` {"command": "artnet_broadcast", "type": "light"} ```  Types are currently work in progress (use light for now) | ``` { "connected": true, "message": "Connected to Artnet!" } ``` |
| send             | ardu                   | ``` { "channel": 1, "value": 255, "blackout": false, "fullOn": false } ```                                        | ``` { "sent": true, "message": "Sent to all slaves!" } ```       |

(Use [ArduinoJSON](https://arduinojson.org/) for deserializing the response.)