module.exports = {
    // socket.io
    socket: {
        port: 8082,
        log_level: 1
    },
    // redis
    redis: {
        server: {
            scheme: 'tcp',
            host: 'localhost',
            port: 6379
        },
        auction_channel: 'auction/dev'
    }
};

