'use strict';

module.exports = function(app) {
	// Routing logic   
	// ...

var users = require('../../app/controllers/users');
	var adminUsers = require('../../app/controllers/admin-users');

	// Projects Routes
	app.route('/adminUsers')
		.get(users.requiresLogin,adminUsers.hasAuthorization,adminUsers.list)
		.post(users.requiresLogin,adminUsers.hasAuthorization, adminUsers.create);
	
	app.route('/adminUsers/:userId')
		.get(users.requiresLogin,adminUsers.hasAuthorization,adminUsers.read)
		.put(users.requiresLogin, adminUsers.hasAuthorization, adminUsers.update)
	    .delete(users.requiresLogin, adminUsers.hasAuthorization, adminUsers.delete);

	// Finish by binding the User middleware
	app.param('userId', adminUsers.userByID);

	

};