var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io  = require("socket.io").listen(server);
var path = require("path");
users = [];
connections = [];

app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.PORT || 3000);
console.log('Server is running....');

app.get('/', function (req, res) {  
    res.sendFile(__dirname+'/index.html');
    // res.sendFile(__dirname+'/chat.js');
});

io.sockets.on('connection', function (socket) {
    // console.log(socket); 
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnected
    socket.on('disconnect', function (data) {  
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket)),
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    //When a new user is added
    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    //When we get a message
    socket.on('send message', function (data) {  
        // console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
    
});