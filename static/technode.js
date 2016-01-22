angular.module('techNodeApp', ['ngRoute']).run(function($window, $rootScope, $http, $location) {
	$http({
		// use Ajax to validate user's info
		url: '/api/validate',
		method: 'GET'
		// if success, go to chatting page
	}).success(function(user) {
		$rootScope.me = user
		$location.path('/')
		// if fail, go to login page
	}).error(function(data) {
		$location.path('/login')
	})
})

