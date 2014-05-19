'use strict';

// Admin user module config
angular.module('admin-user').run(['Menus',
	function(Menus) {
		// Config logic 
		// ...
		Menus.addMenuItem('topbar', 'Admin Users', 'admin-user');
	}
]);