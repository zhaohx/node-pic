var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handler = {};
handler['/'] = requestHandlers.start;
handler['/start'] = requestHandlers.start;
handler['/upload'] = requestHandlers.upload;
handler['/show'] = requestHandlers.show;

server.serverStart(router.route,handler);
