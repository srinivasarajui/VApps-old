'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'toaster',
    function($scope, $stateParams, $location, Authentication, Projects, toaster) {
        $scope.authentication = Authentication;

        // Create new Project
        $scope.create = function() {
            // Create new Project object
            var project = new Projects({
                name: this.name
            });

            // Redirect after save
            project.$save(function(response) {
                $location.path('projects/' + response._id);
            });

            // Clear form fields
            this.name = '';
        };

        // Remove existing Project
        $scope.remove = function(project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects[i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function() {
                    $location.path('projects');
                });
            }
        };

        // Update existing Project
        $scope.update = function() {
            var project = $scope.project;
            if ($scope.chaged) {
                project.$update(function() {
                    $location.path('projects/' + project._id);
                    $scope.chaged = false;
                    toaster.pop('success', 'Saved', 'Saved Project to backend');
                });
            } else {
                $location.path('projects/' + project._id);
            }
        };

        // Find a list of Projects
        $scope.find = function() {
            Projects.query(function(projects) {
                $scope.projects = projects;
                $scope.chaged = false;
            });
        };

        // Find existing Project
        $scope.findOne = function() {
            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                populatePanelTypeCode(project);
                $scope.chaged = false;
                $scope.project = project;

            });
        };

        $scope.LoadPanels = function() {
            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                populatePanelTypeCode(project);
                $scope.chaged = false;
                $scope.submitted = false;
                $scope.project = project;

                if (!$scope.project.rooms) {
                    $scope.project.rooms = [];
                }
                $scope.selectRoom = false;
                if ($scope.project.rooms.length === 0) {
                    $scope.addRoom = true;

                } else {
                    $scope.addRoom = false;

                }
            });
        };
        $scope.selectRooms = function() {
            if ($scope.selectedRoom) {
                $scope.selectRoom = true;
                if ($scope.selectedRoom.items.length === 0) {
                    $scope.addItem = true;

                } else {
                    $scope.addItem = false;

                }
                $scope.selectedItem = null;
            }


        };
        $scope.changeRoom = function() {

            $scope.selectRoom = false;
            saveProject();

        };
        $scope.newRoom = function() {

            $scope.newRoomSubmitted = false;
            $scope.newRoomName = null;
            $scope.addRoom = true;
        };
        $scope.saveRoom = function() {
            $scope.newRoomSubmitted = true;
            if ($scope.addRoomForm.$valid) {
                if (!$scope.project.rooms) {
                    $scope.project.rooms = [];
                }
                $scope.project.rooms.push({
                    name: $scope.newRoomName
                });
                $scope.chaged = true;
                saveProject();
                $scope.newRoomSubmitted = false;
                $scope.addRoom = false;
            }
        };
        /*--------------------*/
        $scope.selectItems = function() {
            if ($scope.selectedItem) {
                $scope.selectItem = true;

            }

        };
        $scope.changeItem = function() {

            $scope.selectItem = false;
            saveProject();


        };
        $scope.newItem = function() {

            $scope.newItemSubmitted = false;
            $scope.newItemName = null;
            $scope.addItem = true;
        };
        $scope.saveItem = function() {
            $scope.newItemSubmitted = true;
            if ($scope.addItemForm.$valid) {
                if (!$scope.selectedRoom.items) {
                    $scope.selectedRoom.items = [];
                }
                $scope.selectedRoom.items.push({
                    name: $scope.newItemName
                });
                $scope.chaged = true;
                saveProject();
                $scope.newItemSubmitted = false;
                $scope.addItem = false;
            }
        };
        /*------------------------*/


        $scope.addPanel = function() {
            $scope.submitted = true;
            if ($scope.newPanelsForm.$valid) {
                if (!$scope.selectedItem.Panels) {
                    $scope.selectedItem.Panels = [];
                }

                $scope.selectedItem.Panels.push({
                    x: $scope.newX,
                    y: $scope.newY,
                    qty: $scope.newQty,
                    panelType: $scope.newPanelType._id,
                    panelTypeCode: $scope.newPanelType.code,
                    comments: $scope.newComments
                });
                addUsageBoard($scope.newPanelType, $scope.selectedItem.Panels[$scope.selectedItem.Panels.length - 1]);
                $scope.chaged = true;
                $scope.newX = null;
                $scope.newY = null;
                $scope.newQty = null;
                $scope.newComments = null;
                $scope.submitted = false;
            }
        };
        $scope.removePanel = function(index) {
            console.log('Remove' + index);
            var type = getPanelType($scope.selectedItem.Panels[index].panelType, $scope.project);
            $scope.chaged = true;
            removeUsageBoard(type, $scope.selectedItem.Panels[index]);
            $scope.selectedItem.Panels.splice(index, 1);

        };
        /*---------------------*/
        $scope.addPanelType = function() {
            $scope.submitted = true;
            if ($scope.newPanelTypesForm.$valid) {
                if (!$scope.project.panelTypes) {
                    $scope.project.panelTypes = [];
                }
                $scope.project.panelTypes.push({
                    code: $scope.newCode,
                    lamType: $scope.newLamType,
                    baseBoard: $scope.newBaseBoard,
                    lam1Color: $scope.newLam1Color,
                    lam2Color: $scope.newLam2Color
                });

                $scope.chaged = true;
                $scope.newCode = null;
                $scope.newLamType = null;
                $scope.newBaseBoard = null;
                $scope.newLam1Color = null;
                $scope.newLam2Color = null;
                $scope.submitted = false;
            }
        };
        $scope.removePanelType = function(index) {
            if (!$scope.project.panelTypes[index].usage) {
                $scope.project.panelTypes[index].usage = 0;
            }
            if ($scope.project.panelTypes[index].usage === 0) {
                $scope.chaged = true;
                $scope.project.panelTypes.splice(index, 1);
            } else {
                toaster.pop('failure', 'Unable to Remove', 'Unable to Remove the Panel Type as it is used in panles');
            }


        };


        function saveProject() {

            if ($scope.chaged) {
                $scope.project.$update(function() {
                    console.log('Test');
                    $scope.chaged = false;
                    toaster.pop('success', 'Saved', 'Saved Project to backend');

                });

            }
        }

        function populatePanelTypeCode(project) {
            for (var i = project.rooms.length - 1; i >= 0; i--) {
                for (var j = project.rooms[i].items.length - 1; j >= 0; j--) {
                    for (var k = project.rooms[i].items[j].Panels.length - 1; k >= 0; k--) {
                        var type = getPanelType(project.rooms[i].items[j].Panels[k].panelType, project);
                        addUsageBoard(type, project.rooms[i].items[j].Panels[k]);
                        project.rooms[i].items[j].Panels[k].panelTypeCode = type.code;
                    }
                }
            }



        }

        function addUsageBoard(type, panel) {
            if (!type.usage) {
                type.usage = 0;
            }
            type.usage = type.usage + (panel.x * panel.y * panel.qty);
        }

        function removeUsageBoard(type, panel) {
            if (!type.usage) {
                type.usage = 0;
            }
            type.usage = type.usage - (panel.x * panel.y * panel.qty);
        }

        function getPanelType(id, project) {
            console.log('in' + id);
            for (var i = project.panelTypes.length - 1; i >= 0; i--) {
                console.log('out' + project.panelTypes[i]._id);


                if (project.panelTypes[i]._id === id)
                    return project.panelTypes[i];
            }
            return null;
        }

    }
]);
