import Quartz.CoreGraphics as CG
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

# Screen Resolution
mainMonitor = CG.CGDisplayBounds(CG.CGMainDisplayID())

def screen_size():
    return (mainMonitor.size.width, mainMonitor.size.height) 

# Runs a mouse event on macOS
def mouseEvent(type, posx, posy):
    theEvent = CG.CGEventCreateMouseEvent(
        None, 
        type, 
        (posx,posy), 
        CG.kCGMouseButtonLeft)
    CG.CGEventPost(CG.kCGHIDEventTap, theEvent)

# Tornado server
class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True
    
    def open(self):
        print('[!] New connection.')
        
        ourEvent = CG.CGEventCreate(None)
        currentpos = CG.CGEventGetLocation(ourEvent)
        
        # Send current mouse position and screen res to client.
        self.write_message(f"{currentpos.x}|{currentpos.y}|{mainMonitor.size.width}|{mainMonitor.size.height}")
      
    def on_message(self, message):
        splited = message.split("|")
        print(splited)
        
        # Very basic com. protocol action|posX|posY
        if splited[0] == "m": # Move action
            mouseEvent(CG.kCGEventMouseMoved, float(splited[1]), float(splited[2]))
        if splited[0] == "c": # Click action
            mouseEvent(CG.kCGEventLeftMouseDown, float(splited[1]), float(splited[2]))
            mouseEvent(CG.kCGEventLeftMouseUp, float(splited[1]), float(splited[2]))
 
    def on_close(self):
        print('[X] Connection closed.')
 
 
application = tornado.web.Application([
    (r'/mouse', WSHandler),
])
 
 
if __name__ == "__main__":
    print("[!] Server is ready.")
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8080)
    tornado.ioloop.IOLoop.current().start()
