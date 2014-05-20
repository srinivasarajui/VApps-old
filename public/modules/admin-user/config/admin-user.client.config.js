'use strict';

// Admin user module config
angular.module('admin-user').run(['Menus', 'Authentication', '_',
    function(Menus, Authentication, _) {
        // Config logic 
        // ...

        if (Authentication.user) {
        	console.log(Authentication.user.roles);
            if (_.find(Authentication.user.roles, function(role) {
                return role === 'ADMIN';
            })) {
                Menus.addMenuItem('topbar', 'Admin Users', 'admin-user');
            }

        }
    }
]);
