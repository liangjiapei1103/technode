angular.module('technodeApp', []);

angular.module('technodeApp').factory('socket', function($rootScope) {
	var socket = io.connect('/');
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				// check the whole app's data status, when something changed, update the information in index.html
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventname, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

angular.module('technodeApp').controller('RoomCtrl', function($scope, socket) {
	$scope.messages = [];

	// update messages into html
	socket.emit('getAllMessages');
	socket.on('allMessages', function(messages) {
		$scope.messages = messages;
	});

	// listen the messageAdded event on server, when there is new message, add it to html
	socket.on('messagesAdded', function(message) {
		$scope.messages.push(message);
	});
});

// after user pressed Enter, the message is sent to the server via Socket
angular.module('technodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
	$scope.newMessage = '';
	$scope.createMessage = function() {
		// do not send empty message
		if ($scope.newMessage == '')
			return

		socket.emit('createMessage', $scope.newMessage);
		// after sending the message, set it back to empty
		$scope.newMessage = '';
	};
});

angular.module('technodeApp').directive('ctrlEnterBreakLine', function() {
	return function (scope, element, attrs) {
		var ctrlDown = false;
		element.bind("keydown", function(evt) {
			if (evt.which === 17) {
				ctrlDown = true;
				setTimeout(function() {
					ctrlDown = false;
				}, 1000);
			}

			if (evt.which === 13) {
				if (ctrlDown) {
					element.val(element.val() + '\n');
				} else {
					scope.$apply(function() {
						scope.$eval(attrs.ctrlEnterBreakLine);
					});
					evt.preventDefault();
				}
			}
		});
	};
});
