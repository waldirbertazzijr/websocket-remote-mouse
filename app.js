// The socket itself
let socket;

// Touch
let touchStartPosition = [];
let touchPosition = [0, 0];
let lastMove;

// Server info
let mousePosition = [];
let screenSize = [];

// Websocket configuration
const server = {
    address: '192.168.0.101', // Change here to your local IP
    port: '8080', // You can change the port on server script
    uri: '/mouse'
};

const sendMessage = (message, socket) => {
    // Send the message through the WebSocket.
    socket.send(message);
};

const onWindowTouchStart = (event) => {
    event.preventDefault();

    // Save last move
    lastMove = event;

    // This variables is for "tap" action handling.
    touchStartPosition[0] = touchPosition[0] = event.originalEvent.touches[0].pageX;
    touchStartPosition[1] = touchPosition[1] = event.originalEvent.touches[0].pageY;

    // If startpos == currenttouchpos then is a "tap" action
    setTimeout(() => {
        if ((touchStartPosition[0] === touchPosition[0]) && (touchStartPosition[1] === touchPosition[1])) {
            $(document).trigger('tap');
        }
    }, 150);

    // DEBUG
    $('#pos').html(`TouchStartPosition: ${touchStartPosition[0]}|${touchStartPosition[1]} <br/> TouchCurrentPosition: ${mousePosition[0]}|${mousePosition[1]}`);
};

const onWindowTouchMove = (event) => {
    event.preventDefault();

    lastMove = event;

    touchPosition[0] = event.originalEvent.touches[0].pageX;
    touchPosition[1] = event.originalEvent.touches[0].pageY;

    let offsetX = mousePosition[0] + ((touchStartPosition[0] - touchPosition[0]) * -1);
    let offsetY = mousePosition[1] + ((touchStartPosition[1] - touchPosition[1]) * -1);

    // do not cross up and leftwards
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;

    // we must stop one pixel before the end
    if (offsetX > screenSize[0]) offsetX = screenSize[0] - 1;
    if (offsetY > screenSize[1]) offsetY = screenSize[1] - 1;

    sendMessage(`m|${offsetX}|${offsetY}`, socket);

    // DEBUG
    $('#pos').html(`TouchStartPosition: ${touchStartPosition[0]}|${touchStartPosition[1]} <br/> MouseOnScreenPosition: ${mousePosition[0]}|${mousePosition[1]} <br/> Delta: ${touchStartPosition[0] - event.originalEvent.touches[0].pageX}|${touchStartPosition[1] - event.originalEvent.touches[0].pageY}`);
};

const onWindowTouchEnd = (event) => {
    event.preventDefault();

    $('#pos').html('TouchEnd');

    mousePosition[0] = mousePosition[0] + ((touchStartPosition[0] - lastMove.originalEvent.touches[0].pageX) * -1);
    mousePosition[1] = mousePosition[1] + ((touchStartPosition[1] - lastMove.originalEvent.touches[0].pageY) * -1);

    if (mousePosition[0] < 0) mousePosition[0] = 0;
    if (mousePosition[1] < 0) mousePosition[1] = 0;

    // we must stop one pixel before the end
    if (mousePosition[0] > screenSize[0]) mousePosition[0] = screenSize[0] - 1;
    if (mousePosition[1] > screenSize[1]) mousePosition[1] = screenSize[1] - 1;

    $('#pos').html(`MouseCurrentPosition: ${mousePosition[0]}|${mousePosition[1]}`);
};

const onWindowTap = (event) => {
    event.preventDefault();

    sendMessage(`c|${mousePosition[0]}|${mousePosition[1]}`, socket);
};

window.onload = () => {
    // New websocket
    socket = new WebSocket(`ws://${server.address}:${server.port}${server.uri}`);

    // Changes background color to show that ws is up.
    socket.onopen = (event) => {
        $('html').css({ 'background': '#009DFF' });
        $('#messages').text(`Connected to ${event.currentTarget.URL}`);
        $('#pos').html("READY");

        console.log('connected');
    };

    // Error handler
    socket.onerror = (error) => {
        $('html').css({ 'background': '#ff0033' });
        $('#messages').text('Error: see console for details.');

        console.log(error);
    };

    // Messages sent by the server.
    socket.onmessage = (event) => {
        const message = event.data;
        const split = message.split("|");

        // Current mouse pos on server
        mousePosition[0] = parseFloat(split[0]);
        mousePosition[1] = parseFloat(split[1]);

        // Current server screen resolution
        screenSize[0] = parseFloat(split[2]);
        screenSize[1] = parseFloat(split[3]);
    };

    // Changes background color to show that ws is down.
    socket.onclose = (event) => {
        $('#messages').text(`${event.code} ---- ${event.reason}`);
        $('html').css({ 'background': '#ff0033' });
    };


    // Window touch events handler.
    $(document).on('touchstart', onWindowTouchStart);
    $(document).on('touchmove', onWindowTouchMove);
    $(document).on('touchend', onWindowTouchEnd);
    $(document).on('tap', onWindowTap);
};