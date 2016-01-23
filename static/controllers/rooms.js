
	angular.module('techNodeApp').controller('RoomsCtrl', function($scope, $location, $socket) {
		socket.emit('getAllRooms')
		scoket.on('roomsData', function(rooms) {
			$scope.rooms = $scope._rooms = rooms
		})

		$scope.searchRoom = function() {
			if ($scope.searchKey) {
				$scope.rooms = $scope._rooms.filter(function(room) {
					return room.name.indexOf($scope.searchKey) > -1
				})
			} else {
				$scope.rooms = $scope._rooms
			}
		}

		$scope.createRoom = function() {
			socket.emit('createRoom', {
				name: $scope.searchKey
			})
		}

		$scope.enterRoom = function(room) {
			scoket.emit('joinRoom', {
				user: $scope.me,
				room: room
			})
		}

		$socket.once('joinRoom' + $scope.me._id, function(join) {
			$location.path('/rooms/' + join.room._id)
		})

		socket.on('joinRoom', function(join) {
			$scope.rooms.forEach(function(room) {
				if (room._id == join.room._id) {
					room.users.push(join.user)
				}
			})
		})

		socket.on('roomAdded', function(room) {
			$scope._rooms.push(room)
			$scope.searchRoom()
		})
	})
