var port = 50000;
var http_server = require('http').createServer();
var socket = require('socket.io').listen( http_server );

socket.set('log level', 1);


socket.configure(function (){
    socket.set('authorization', function (handshakeData, callback) {
        //console.log('auth - ', handshakeData);
        callback(null, true);
        /*findDatabyIP(handshakeData.address.address, function (err, data) {
            if (err) return callback(err);

            if (data.authorized) {
                handshakeData.foo = 'bar';
                for(var prop in data) handshakeData[prop] = data[prop];
                callback(null, true);
            } else {
                callback(null, false);
            }
        })*/
    });
});

socket.sockets.on('connection', function (socket) {
    console.log('connect');

    var hs = socket.handshake;
    var room_name = get_room_name(hs.query.appointment);

    socket.join(room_name);

    socket.emit('connected');

    //console.log('hs q - ',room_name);



    socket.on('call', function( data ) {
        socket.broadcast.to(room_name).emit('call', data);
    });

    socket.on('disconnect', function () {

    });
    socket.on('close', function () {

    });
});

http_server.listen( port, function( err ) {
    console.log( 'Test server ready at port '+port+'.' );
});


function get_room_name(number){
    return 'appointment_room_'+number;
}