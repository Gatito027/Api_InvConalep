const { Server } = require('socket.io');

let io;

const initSocket = (server, allowedOrigins) => {
    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) throw new Error('Socket.io no ha sido inicializado');
    return io;
};

module.exports = { initSocket, getIo };