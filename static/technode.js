angular.module('techNodeApp', ['ngRoute']).run(function($window, $rootScope, $http, $location) {
	$http({
		// use Ajax to validate user's info
		url: '/ajax/validate',
		method: 'GET'
		// if success, go to chatting page
	}).success(function(user) {
		$rootScope.me = user
		$location.path('/')
		// if fail, go to login page
	}).error(function(data) {
		$location.path('/login')
	})
	$rootScope.logout = function() {
		$http({
			url: '/ajax/logout',
			method: 'GET'
		}).success(function() {
			$rootScope.me = null
			$location.path('/login')
		})
	}
	$rootScope.$on('login', function(evt, me) {
		$rootScope.me = me
	})
})

