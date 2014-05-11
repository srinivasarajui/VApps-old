'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
	function($stateProvider) {
		// Projects state routing
		$stateProvider.
		state('listProjects', {
			url: '/projects',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).
		state('createProject', {
			url: '/projects/create',
			templateUrl: 'modules/projects/views/create-project.client.view.html'
		}).
		state('viewProject', {
			url: '/projects/:projectId',
			templateUrl: 'modules/projects/views/view-project.client.view.html'
		}).
		state('editProject', {
			url: '/projects/:projectId/edit',
			templateUrl: 'modules/projects/views/edit-project.client.view.html'
		}).
        state('panelTypes', {
            url: '/projects/:projectId/panelTypes',
            templateUrl: 'modules/projects/views/manage-panelTypes.client.view.html'
        }).
        state('panels', {
            url: '/projects/:projectId/panels',
            templateUrl: 'modules/projects/views/manage-panels.client.view.html'
        });
	}
]);