Websocket Remote Mouse
======================

A simple client and server setup for controlling your computer mouse trough your LAN with a smartphone and python with tornado server.

# Setup
```
pip install -r requirements
```

This will install tornado and pyobjc-framework-Quartz lib.


# Server Setup
Clone this repo to anywhere you want acessible.
Head to server/ folder and run

```
python macos.py
```

There is only support for Mac OS for now. Run it and wait for the server to be ready.


# Client Setup
Type this on your terminal to get your local IP address:
```
ipconfig getifaddr en0
```

Or whatever your network interface is (en0, en1...)

Now copy your local IP address. Open up the _app.js_ file and change the server.address (line 16) string to your IP.

## Pick up your smartphone and get ready to the fun part.
Head, on your smartphone, the the location (on your local webserver) that contains the code you just cloned.
Now just move your fingers! You should see the message "new connection" on your server and the browser should be blue.

Touch - mouse move
Tap - mouse click