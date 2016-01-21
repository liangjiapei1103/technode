angular.module('techNodeApp', [])

angular.module('techNodeApp').factory('socket', function($rootScope) {
	// var socket = io.connect('/')
  	//为了避免跨域请求，需要将原来的var socket = io.connect('/')改成下面这一行
  	// var socket = io.connect('http://localhost:3000/')
  	//或者采用socket官方主页上面的方法 var socket = io()
  	var socket = io();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments
				// check the whole app's data status, when something changed, update the information in index.html
				$rootScope.$apply(function() {
					callback.apply(socket, args)
				})
			})
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				})
			})
		}
	}
})

angular.module('techNodeApp').controller('RoomCtrl', function($scope, socket) {
	$scope.messages = []
	// update messages into html
	socket.on('messages.read', function (messages) {
		$scope.messages = messages;
	})

	// listen the messageAdded event on server, when there is new message, add it to html
	socket.on('messages.add', function (message) {
		$scope.messages.push(message)
	});
	socket.emit('messages.read')
})

// after user pressed Enter, the message is sent to the server via Socket
angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
	// $scope.newMessage = '';
	$scope.createMessage = function() {
		// do not send empty message
		if ($scope.newMessage == '')
			return

		socket.emit('messages.create', $scope.newMessage)
		// after sending the message, set it back to empty
		$scope.newMessage = ''
	};
});

angular.module('techNodeApp').directive('autoScrollToBottom', function() {
	return {
		link: function(scope, element, attrs) {
			scope.$watch(function() {
				return element.children().length;
			},
			function() {
				element.animate({
					scrollTop: element.prop('scrollHeight')
				}, 1000);
			});
		}
	};
});

angular.module('techNodeApp').directive('ctrlEnterBreakLine', function() {
	return function (scope, element, attrs) {
		var ctrlDown = false
		element.bind("keydown", function(evt) {
			if (evt.which === 17) {
				ctrlDown = true
				setTimeout(function() {
					ctrlDown = false
				}, 1000)
			}

			if (evt.which === 13) {
				if (ctrlDown) {
					element.val(element.val() + '\n')
				} else {
					scope.$apply(function() {
						scope.$eval(attrs.ctrlEnterBreakLine);
					});
					evt.preventDefault()
				}
			}
		});
	};
});