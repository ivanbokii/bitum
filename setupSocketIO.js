var io = require('socket.io')

module.exports = function (server) {
  var sio = io.listen(server);

  sio.sockets.on('connection', setupSocket);
}

function setupSocket (socket) {
  global.sockets.push(socket);

  socket.on('disconnect', function () {
    var indexToRemove = global.sockets.indexOf(socket);
    global.sockets.splice(indexToRemove, 1);
  });
}