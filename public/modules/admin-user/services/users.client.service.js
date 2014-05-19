'use strict';
angular.module('admin-user').factory('AdminUsers', ['$resource', function($resource) {
    return $resource('adminUsers/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);