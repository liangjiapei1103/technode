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