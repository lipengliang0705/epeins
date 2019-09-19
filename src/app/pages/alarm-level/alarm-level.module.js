(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-level', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('alarm-level', {
            url: '/alarm-level',
            templateUrl: 'app/pages/alarm-level/alarm-levels.html',
            controller: 'AlarmLevelController',
            controllerAs: 'vm',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AlarmLevels'
            },
           resolve: {
            }
        })

        .state('alarm-level-detail', {
            parent: 'alarm-level',
            url: '/alarm-level/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AlarmLevel'
            }, 
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-level/alarm-level-detail.html',
                    controller: 'AlarmLevelDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmLevel', function(AlarmLevel) {
                            return AlarmLevel.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        }) 
        .state('alarm-level-detail.edit', {
            url: '/detail/edit',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-level/alarm-level-dialog.html',
                    controller: 'AlarmLevelDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmLevel', function(AlarmLevel) {
                            return AlarmLevel.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-level.new', {
            url: '/new',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-level/alarm-level-dialog.html',
                    controller: 'AlarmLevelDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                color: null,
                                description: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('alarm-level', null, { reload: 'alarm-level' });
                }, function() {
                    $state.go('alarm-level');
                });
            }]
        })
        .state('alarm-level.edit', {
            url: '/{id}/edit',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-level/alarm-level-dialog.html',
                    controller: 'AlarmLevelDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmLevel', function(AlarmLevel) {
                            return AlarmLevel.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-level', null, { reload: 'alarm-level' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-level.delete', {
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-level/alarm-level-delete-dialog.html',
                    controller: 'AlarmLevelDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['AlarmLevel', function(AlarmLevel) {
                            return AlarmLevel.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-level', null, { reload: 'alarm-level' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
