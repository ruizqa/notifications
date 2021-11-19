const express = require( 'express' );
let path = require('path');
const app = express();
let log=[]
let message;
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

const server = app.listen(8888);

const io = require( 'socket.io' )( server );

app.get('/', function(req, res) {
    res.render("index", {});
})

io.on( 'connection', function( socket ){
    message = {id: socket.id, type:'join'}
    log.push(message)
    socket.emit('allMessages', {messages:log})
    socket.broadcast.emit( 'newMessage', {message:message} );
    socket.on('notification', function(){
        message = {id: socket.id, type:'notification'}
        log.push(message)
        io.emit( 'newMessage', {message:message} );
    })

    socket.on('disconnect', function(){
        message = {id: socket.id, type:'disconnect'}
        log.push(message)
        socket.broadcast.emit( 'newMessage', {message:message} );
    })

});



