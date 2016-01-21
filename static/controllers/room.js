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