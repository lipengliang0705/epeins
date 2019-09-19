(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-result',[])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        
        .state('alarm-result', {
            title: '告警信息',
            url: '/alarm-result',
            templateUrl: 'app/pages/alarm-result/alarm-result.html',
            controller: 'AlarmResultController',
            controllerAs: 'vm',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AlarmResult'
            },
            resolve: {
            },
            sidebarMeta: {
                order: 802
            },
        })
        .state('alarm-result-detail', {
            parent: 'alarm-result',
            url: '/alarm-result-detail/{id}',
            data: {
                authorities: ['ROLE_USER']                
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                 
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-result/alarm-result-detail.html',
                    controller: 'AlarmResultDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: [ 'AlarmResult', function( AlarmResult) {
                            
                            // console.log('1---', AlarmResult);

                            return AlarmResult.get({id : $stateParams.id}).$promise;
                        }],
                        previousState: ["$state", function ($state) {
                            var currentStateData = {
                                name: $state.current.name || 'alarm-result',
                                params: $state.params,
                                url: $state.href($state.current.name, $state.params)
                            };
                            
                            //console.log('currentStateData',currentStateData);
                             return currentStateData;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-result', null, { reload: 'alarm-result' });
                }, function() {
                    $state.go('alarm-result');
                })
            }]
           
        })
        .state('alarm-result-detail.edit', {
            parent: 'alarm-result-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-result/alarm-result-dialog.html',
                    controller: 'AlarmResultDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmResult', function(AlarmResult) {
                            return AlarmResult.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-result.new', {
            parent: 'alarm-result',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-result/alarm-result-dialog.html',
                    controller: 'AlarmResultDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                alarmType: null,
                                conf: null,
                                notifyType: null,
                                notifyRole: null,
                                notifyMember: null,
                                createdBy: null,
                                createTime: null,
                                modifiedBy: null,
                                modifiedTime: null,
                                status: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('alarm-result', null, { reload: 'alarm-result' });
                }, function() {
                    $state.go('alarm-result');
                });
            }]
        })
        .state('alarm-result.edit', {
            parent: 'alarm-result',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-result/alarm-result-dialog.html',
                    controller: 'AlarmResultDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmResult', function(AlarmResult) {
                            return AlarmResult.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-result', null, { reload: 'alarm-result' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-result.delete', {
            parent: 'alarm-result',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-result/alarm-result-delete-dialog.html',
                    controller: 'AlarmResultDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['AlarmResult', function(AlarmResult) {
                            return AlarmResult.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-result', null, { reload: 'alarm-result' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
