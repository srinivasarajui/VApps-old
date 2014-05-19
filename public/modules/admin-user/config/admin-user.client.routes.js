'use strict';

//Setting up route
angular.module('admin-user').config(['$stateProvider',
	function($stateProvider) {
		// Admin user state routing
		$stateProvider.
		state('user-add', {
			url: '/admin-user/create',
			templateUrl: 'modules/admin-user/views/user-add.client.view.html'
		}).
		state('user-edit', {
			url: '/admin-user/:userId/edit',
			templateUrl: 'modules/admin-user/views/user-edit.client.view.html'
		}).
		state('admin-user', {
			url: '/admin-user',
			templateUrl: 'modules/admin-user/views/admin-user.client.view.html'
		});
	}
]);
