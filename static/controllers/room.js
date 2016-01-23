angular.module('techNodeApp').controller('RoomCtrl', function($scope, $routeParams, $scope, socket) {
  socket.on('technode.read', function (technode) {
    $scope.technode = technode
  })
  socket.on('messages.add', function (message) {
    $scope.technode.messages.push(message)
  })
  socket.emit('technode.read')
  socket.on('users.add', function (user) {
    $scope.technode.users.push(user)
  })
  socket.on('users.remove', function (user) {
    _userId = user._id
    $scope.technode.users = $scope.technode.users.filter(function (user) {
      return user._id != _userId
    })
  })
  socket.emit('getAllRooms', {
    _roomId: $routeParams._roomId
  })
  socket.on('roomData' + $routeParams._roomId, function(room) {
    $scope.room = room
  })
  socket.on('messageAdded', function(message) {
    $scope.room.messages.push(message)
  })
  scoket.on('joinRoom', function(join) {
    $scope.room.users.push(join.user)
  })
})