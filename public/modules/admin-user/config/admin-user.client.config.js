'use strict';

// Admin user module config
angular.module('admin-user').run(['Menus', 
    function(Menus) {
   
                Menus.addMenuItem('topbar', 'Admin Users', 'admin-user','route',true,['ADMIN']);
            
    }
]);
