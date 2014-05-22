'use strict';

angular.module('admin-user').controller('AdminUserController', ['$scope','$stateParams', '$location', 'Authentication', 'AdminUsers', 'toaster', '_',
    function($scope, $stateParams, $location, Authentication, AdminUsers, toaster, _) {
        $scope.authentication = Authentication;

        // Find a list of Users
        $scope.find = function() {
            AdminUsers.query(function(users) {
                $scope.users = users;
               
            });
        };

        // Find existing Project
        $scope.findOne = function() {
            console.log( $stateParams.userId);
            AdminUsers.get({
                userId: $stateParams.userId
            }, function(user) {
               $scope.credentials = user;

            });
        };

         // Create new User
        $scope.addUser = function() {
            // Create new Project object
            var user = new AdminUsers({
                firstName: $scope.credentials.firstName,
                lastName: $scope.credentials.lastName,
                email: $scope.credentials.email,
                username: $scope.credentials.username,
                password: $scope.credentials.password
            });

            // Redirect after save
            user.$save(function(response) {
                $location.path('admin-user');
            });

            // Clear form fields
            $scope.credentials.firstName = '';
            $scope.credentials.lastName= '';
            $scope.credentials.email = '';
            $scope.credentials.username = '';
            $scope.credentials.password='';
        };
        // Remove existing Project
        $scope.remove = function(user) {
            if (user) {
                user.$remove();

                for (var i in $scope.users) {
                    if ($scope.users[i] === user) {
                        $scope.users.splice(i, 1);
                    }
                }
            } else {
                console.log('Found');
                $scope.user.$remove(function() {
                    console.log('Remove');
                    $location.path('admin-user');
                });
            }
        };

        // Update existing User
        $scope.updateUser = function() {
            var user = $scope.credentials;
            user.$update(function() {
                $location.path('admin-user');
                
                toaster.pop('success', 'Saved', 'Saved user to backend');
            });
        };

    }
]);