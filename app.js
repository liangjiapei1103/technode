var express = require('express')
var app = express()
var path = require('path')
var port = process.env.PORT || 3000

// put static file on static folder
app.use(express.static(path.join(__dirname, '/static')))
var messages = []
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var Controllers = require('./controllers')
var signedCookieParser = cookieParser('technode')
var MongoStore = require('connect-mongo')(session)
var cookie = require('cookie');
var async = require('async');
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
	},
	store: sessionStore
}))

var server = app.listen(port, function() {
	console.log('Technode is on port ' + port + '!')
})


// index.html will be the initial web page
app.use(function (req, res) {
	res.sendFile(path.join(__dirname, './static/index.html'));
})

app.get('/api/validate', function (req, res) {
	var _userId = req.session._userId
	if (_userId) {
		Controllers.User.findUserById(_userId, function(err, user) {
			if (err) {
				res.status(401).json({
					msg: err
				})
			} else {
				res.json(user)
			}
		})
	} else {
		res.status(401).json(null)
	}
})

app.post('/api/login', function(req, res) {
	var email = req.body.email
	if (email) {
		Controllers.User.findByEmailOrCreate(email, function (err, user) {
			if (err) {
				res.json(500, {
					msg: err
				})
			} else {
				req.session._userId = user._id
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



var io = require('socket.io').listen(server) 

// io.set('authorization', function (handshakeData, accept) {
// 	signedCookieParser(handshakeData, {}, function(err) {
// 		if (err) {
// 			accept(err, false)
// 		} else {
// 			sessionStore.get(handshakeData.signedCookies['connect.sid'], function(err, session) {
// 				if (err) {
// 					accept(err.message, false)
// 				} else {
// 					handshakeData.session = session
// 					if (session._userId) {
// 						accept(null, true)
// 					} else {
// 						accept('No login')
// 					}
// 				}
// 			})
// 		}
// 	})
// })                              

io.set('authorization', function(handshakeData, accept) {
	if(handshakeData.headers.cookie){
     var cookies = cookie.parse(handshakeData.headers.cookie);
     var connectSid = cookies['connect.sid'];
     if(connectSid){
	    var connected = cookieParser.signedCookie(connectSid, 'technode');
	    if(connected){
		     sessionStore.get(connected, function (error, session) {
			    if (error) {
			     	accept(error.message, false)
			    }else{
			     	handshakeData.headers.sessions  = session;
				    if(session._userId){
				     	accept(null, true)
				    }else{
				     	accept('No login')
				    }
			    }
		     })
		}else {
		    accept('No session')
		}
	 }
	}
 });

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












