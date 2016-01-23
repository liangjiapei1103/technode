var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var Controller = require('./controllers')
var signedCookieParser = cookieParser('technode')
var MongoStore = require('connect-mongo')(session)
var sessionStore = new MongoStore({
	url : 'mongodb://localhost/technode'
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(cookieParser())
app.use(session({
	secret: 'technode',
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: 60 * 1000 * 60
	}
}))


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

var io = require('socket.io').listen(server)     z                                   

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

io.set('authorization', function (handshakeData, accept) {
	signedCookieParser(handShakeData, {}, function(err) {
		if (err) {
			accept(err, false)
		} else {
			sessionStore.get(handshakeData.signedCookie['connect.sid'], function(err, session) {
				if (err) {
					accept(err, false)
				} else {
					handshakeData.session = session
					if (session._userId) {
						accept(null, true)
					} else {
						accept('No login')
					}
				}
			}
		}
	})
})

app.get('/api/validate', function (req, res) {
	var userId = req.session._userId
	if (_userId) {
		Controllers.User.findUserById(_userId, function(err, res) {
			if (err) {
				res.json(401, {
					mas: err
				})
			} else {
				res.json(user)
			}
		})
	} else {
		res.json(401, null)
	}
})

app.get('/api/login', function(req, res) {
	var email = req.body.email
	if (email) {
		Controllers.User.findByEmailOrCreate(email, function (err, user) {
			if (err) {
				res.json(500, {
					msg: err
				})
			} else {
				req.session._userId = user._userId
				res.json(user)
			}
		})
	} else {
		res.join(403)
	}
})

app.get('/api/logout', function (req, res) {
	req.session._userId = null
	res.join(401)
})
