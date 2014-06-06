Websocket Remote Mouse
======================

A simple client and server setup for controlling your computer mouse trough your LAN with a smartphone and python with tornado server.

# Setup
First you will need to install [Tornado](http://www.tornadoweb.org/en/stable/) web server. It is as simple as running:
```
easy_install tornado
```
or
```
pip install tornado
```


# Server Setup
Clone this repo to anywhere you want acessible trough your LAN (in your apache folder, for instance).
Head to server/ folder and run
```
python macos.py
```
There is only support for Mac OS for now. Run it and wait for the server to be ready.


# Client Setup
Type this on your terminal to get your local IP address:
```
ipconfig getifaddr en1
```
now copy your local IP address. Open up the _app.js_ file and change the server.address (line 16) string to your IP.

## Pick up your smartphone and get ready to the fun part.
Head, on your smartphone, the the location (on your local webserver) that contains the code you just cloned.
Now just move your fingers! You should see the message "new connection" on your server and the browser should be blue.

Touch - mouse move
Tap - mouse click