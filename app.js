var express = require('express')
var app = express()
var path = require('path')

var port = process.env.PORT || 3000

// put static file on static folder
app.use(express.static(path.join(__dirname, '/static')))
// index.html will be the initial web page
app.use(function (req, res) {
	res.sendFile(path.join(__dirname, './static/index.html'));
})

var server = app.listen(port, function() {
	console.log('Technode is on port ' + port + '!')
})

var io = require('socket.io').listen(server)

var messages = []

io.sockets.on('connection', function(socket) {
	// when making connection, emit  get all message to get all messages, save messages into messages array
	socket.on('messages.read', function() {
		socket.emit('messages.read.', messages);
	});

	socket.on('messages.create', function(message) {
		messages.push(message);
		io.sockets.emit('messages.add', message)
	})
})