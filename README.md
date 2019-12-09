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
| Route | HTTP Type | Description                                   | Usage                                                                                                                          |
|-------|-----------|-----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| /     | GET       | Shows status of the Server.                   | Response:<br><br>```<br>{<br>  "status": "Online",<br>  "packets": {<br>    "send": 0,<br>    "received": 0<br>  }<br>}<br>``` |
| /send | POST      | Send ArtNet commands to every Slave connected | <br>Post Body:```<br>{<br>    "channel": 1,<br>    "value": 255,<br>    "blackout": false,<br>    "fullOn": false<br>}<br>```  |