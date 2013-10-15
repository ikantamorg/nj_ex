var settings = require('./config'),
    redis   = require("redis"),
    fs = require('fs');

var svrOptions = {
    key: fs.readFileSync('/etc/httpd/private/https.key'),
    cert: fs.readFileSync('/etc/httpd/certs/sitename.crt')
};


// Create a Basic server and response
var app = require('https').createServer(svrOptions, function( req , res ){
    res.writeHead(200);
    res.end('end....\n');
});

var io = require('socket.io').listen(app);

app.listen( settings.socket.port );

io.set('log level', settings.socket.log_level)

// Socket handler
var auction = io.of('/auction');

//connect to redis
var RedisClient = redis.createClient(settings.redis.server.port, settings.redis.server.host);
// subscribe to channel
RedisClient.subscribe(settings.redis.auction_channel);
//listen
RedisClient.on("message", function(channel, message) {
    try { var data = JSON.parse(message); }
    catch (SyntaxError) { return false; }

    switch(data.type){
        case 'add':
        case 'update':
        case 'remove':
            auction.emit(data.type, data.data);
            break;
    }

});
