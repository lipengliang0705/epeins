(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.menu-management',[])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {

        $stateProvider.state('menu-management', {
            url: '/menu-management',
            templateUrl: 'app/pages/menu-management/menu-management.html',
            controller: 'MenuManagementController',
            controllerAs: 'vm',
            resolve: {
            }
        })
        .state('menu-management.new', {      
            parent: 'menu-management',        
            url: '/new',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/menu-management/menu-management-dialog.html',
                    controller: 'MenuManagementDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                id: null, name:null, description:null, info:null
                            };
                        },
                        mainTreeData: ['MenuManagement', function(MenuManagement) {
                            return MenuManagement.get({id : 1}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('menu-management', null, { reload: true });
                }, function() {
                    $state.go('menu-management');
                });
            }]
        })
        .state('menu-management.edit', {         
            parent: 'menu-management',     
            url: '/{id}/edit',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/menu-management/menu-management-dialog.html',
                    controller: 'MenuManagementDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['MenuManagement', function(MenuManagement) {
                            return MenuManagement.get({id : $stateParams.id}).$promise;
                        }],
                        mainTreeData: ['MenuManagement', function(MenuManagement) {
                            return MenuManagement.get({id : 1}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('menu-management', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('menu-management-detail', {
            parent: 'menu-management',
            url: '/menu-management/{id}',             
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/menu-management/menu-management-detail.html',
                    controller: 'MenuManagementDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['MenuManagement', function(MenuManagement) {
                            return MenuManagement.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('menu-management.delete', {
            parent: 'menu-management',
            url: '/{id}/delete',          
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/menu-management/menu-management-delete-dialog.html',
                    controller: 'MenuManagementDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['MenuManagement', function(MenuManagement) {
                            return MenuManagement.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('menu-management', null, { reload: 'menu-management' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }
})();
