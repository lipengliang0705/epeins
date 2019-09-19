(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.role-management',[])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {

        $stateProvider.state('role-management', {
            url: '/role-management',
            templateUrl: 'app/pages/role-management/role-management.html',
            controller: 'RoleManagementController',
            controllerAs: 'vm',
            resolve: {
            }
        })
        .state('role-management.new', {      
            parent: 'role-management',        
            url: '/new',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/role-management/role-management-dialog.html',
                    controller: 'RoleManagementDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                id: null, name:null, description:null, menuTree:null ,category:null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('role-management', null, { reload: true });
                }, function() {
                    $state.go('role-management');
                });
            }]
        })
        .state('role-management.edit', {         
            parent: 'role-management',     
            url: '/{id}/edit',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/role-management/role-management-dialog.html',
                    controller: 'RoleManagementDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['RoleManagement', function(RoleManagement) {
                            return RoleManagement.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('role-management', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('role-management-detail', {
            parent: 'role-management',
            url: '/role-management/{id}',             
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/role-management/role-management-detail.html',
                    controller: 'RoleManagementDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['RoleManagement', function(RoleManagement) {
                            return RoleManagement.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('role-management.delete', {
            parent: 'role-management',
            url: '/{id}/delete',          
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/role-management/role-management-delete-dialog.html',
                    controller: 'RoleManagementDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['RoleManagement', function(RoleManagement) {
                            return RoleManagement.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('role-management', null, { reload: 'role-management' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }
})();
