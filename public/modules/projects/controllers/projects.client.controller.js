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
                populateTypeCode(project);
                $scope.chaged = false;
                $scope.project = project;

            });
        };

        $scope.LoadPanels = function() {
            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                populateTypeCode(project);
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
                    ebType: $scope.newEBType._id,
                    ebTypeCode: $scope.newEBType.code,
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
                console.log($scope.newLamType);

                $scope.project.panelTypes.push({
                    code: $scope.newCode,
                    lamType: $scope.newLamType,
                    baseBoard: $scope.newBaseBoard,
                    thickness: $scope.newThickness,
                    lam1Color: $scope.newLam1Color,
                    lam2Color: $scope.newLam2Color
                });

                $scope.chaged = true;
                $scope.newCode = null;
                $scope.newLamType = null;
                $scope.newBaseBoard = null;
                $scope.newThickness = null;
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

        /*---------------------*/
        $scope.addEBType = function() {
            $scope.submitted = true;
            if ($scope.newEBTypesForm.$valid) {
                if (!$scope.project.ebTypes) {
                    $scope.project.ebTypes = [];
                }

                $scope.project.ebTypes.push({
                    code: $scope.newEBCode,
                    l1Thickness: $scope.newL1Thickness,
                    l1Color: $scope.newL1Color,
                    w1Thickness: $scope.newW1Thickness,
                    w1Color: $scope.newW1Color,
                    l2Thickness: $scope.newL2Thickness,
                    l2Color: $scope.newL2Color,
                    w2Thickness: $scope.newW2Thickness,
                    w2Color: $scope.newW2Color,
                });

                $scope.chaged = true;
                $scope.newEBCode = null;
                $scope.newL1Thickness = null;
                $scope.newL1Color = null;
                $scope.newW1Thickness = null;
                $scope.newW1Color = null;
                $scope.newL2Thickness = null;
                $scope.newL2Color = null;
                $scope.newW2Thickness = null;
                $scope.newW2Color = null;
                $scope.submitted = false;
            }
        };
        $scope.removeEBType = function(index) {
            if (!$scope.project.ebTypes[index].usageL1) {
                $scope.project.ebTypes[index].usageL1 = 0;
            }
            if ($scope.project.panelTypes[index].usageL1 === 0) {
                $scope.chaged = true;
                $scope.project.panelTypes.splice(index, 1);
            } else {
                toaster.pop('failure', 'Unable to Remove', 'Unable to Remove the Edge Band Type as it is used in panles');
            }


        };
        /*--*/

        function saveProject() {

            if ($scope.chaged) {
                $scope.project.$update(function() {

                    $scope.chaged = false;
                    toaster.pop('success', 'Saved', 'Saved Project to backend');

                });

            }
        }

        function populateTypeCode(project) {
            for (var i = project.rooms.length - 1; i >= 0; i--) {
                for (var j = project.rooms[i].items.length - 1; j >= 0; j--) {
                    for (var k = project.rooms[i].items[j].Panels.length - 1; k >= 0; k--) {
                        var type = getPanelType(project.rooms[i].items[j].Panels[k].panelType, project);
                        addUsageBoard(type, project.rooms[i].items[j].Panels[k]);
                        project.rooms[i].items[j].Panels[k].panelTypeCode = type.code;
                        type = getEbType(project.rooms[i].items[j].Panels[k].ebType, project);
                        project.rooms[i].items[j].Panels[k].ebTypeCode = type.code;
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

            for (var i = project.panelTypes.length - 1; i >= 0; i--) {
                if (project.panelTypes[i]._id === id)
                    return project.panelTypes[i];
            }
            return null;
        }

        function getEbType(id, project) {
            for (var i = project.ebTypes.length - 1; i >= 0; i--) {
                if (project.ebTypes[i]._id === id)
                    return project.ebTypes[i];
            }
            return null;
        }
        $scope.getLamText = function(code) {
            var returnValue = '';
            if (code === 'pre') {
                returnValue = 'Pre Lam';
            }
            if (code === 'post') {
                returnValue = 'Post';
            }
            return returnValue;

        }
        $scope.getThicknessText = function(code) {
            var returnValue = '';
            if (code === '0') {
                returnValue = 'NO EB';
            }
            if (code === '5') {
                returnValue = '0.5 mm';
            }
            if (code === '8') {
                returnValue = '0.8 mm';
            }
            if (code === '20') {
                returnValue = '2.0 mm';
            }
            return returnValue;
        };

    }
]);
