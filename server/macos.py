import time
from Quartz import CGDisplayBounds
from Quartz import CGMainDisplayID
from Quartz.CoreGraphics import CGEventCreateMouseEvent
from Quartz.CoreGraphics import CGEventPost
from Quartz.CoreGraphics import kCGEventMouseMoved
from Quartz.CoreGraphics import CGEventCreate
from Quartz.CoreGraphics import CGEventGetLocation
from Quartz.CoreGraphics import kCGEventLeftMouseDown
from Quartz.CoreGraphics import kCGEventLeftMouseDown
from Quartz.CoreGraphics import kCGEventLeftMouseUp
from Quartz.CoreGraphics import kCGMouseButtonLeft
from Quartz.CoreGraphics import kCGHIDEventTap

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

# Screen Resolution
mainMonitor = CGDisplayBounds(CGMainDisplayID())

def screen_size():
    mainMonitor = CGDisplayBounds(CGMainDisplayID())
    return (mainMonitor.size.width, mainMonitor.size.height) 
 
# Runs a mouse event on macos
def mouseEvent(type, posx, posy):
    theEvent = CGEventCreateMouseEvent(
                None, 
                type, 
                (posx,posy), 
                kCGMouseButtonLeft)
    CGEventPost(kCGHIDEventTap, theEvent)

# Tornado server
class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print '[!] New connection.'
        
        ourEvent = CGEventCreate(None)
        currentpos = CGEventGetLocation(ourEvent)
        
        # Send current mouse position and screen res to client.
        self.write_message(str(currentpos.x)+"|"+str(currentpos.y)+"|"+str(mainMonitor.size.width)+"|"+str(mainMonitor.size.height))
      
    def on_message(self, message):
        splited = message.split("|")
        print splited
        
        # Very basic com. protocol action|posX|posY
        if splited[0] == "m": # Move action
            mouseEvent(kCGEventMouseMoved, float(splited[1]), float(splited[2]))
        if splited[0] == "c": # Click action
            mouseEvent(kCGEventLeftMouseDown, float(splited[1]), float(splited[2]))
            mouseEvent(kCGEventLeftMouseUp, float(splited[1]), float(splited[2]))
 
    def on_close(self):
        print '[X] Connection closed.'
 
 
application = tornado.web.Application([
    (r'/mouse', WSHandler),
])
 
 
if __name__ == "__main__":
    print "[!] Server is ready."
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8080)
    tornado.ioloop.IOLoop.instance().start()