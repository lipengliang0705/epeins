(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.alarm-rule', ['LoginsightUiApp.page.alarm-level'])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('alarm-rule', {
            title: '告警规则',
            url: '/alarm-rule',
            templateUrl: 'app/pages/alarm-rule/alarm-rules.html',
            controller: 'AlarmRuleController',
            controllerAs: 'vm',
            resolve: {
            },
            sidebarMeta: {
                order: 802
            },
        }) 
        .state('alarm-rule-detail', {
            parent: 'alarm-rule',
            url: '/alarm-rule/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AlarmRule'
            }, 
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-rule/alarm-rule-detail.html',
                    controller: 'AlarmRuleDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['AlarmRule', function(AlarmRule) {
                            return AlarmRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-rule-detail.edit', {
            parent: 'alarm-rule-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-rule/alarm-rule-dialog.html',
                    controller: 'AlarmRuleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    //size: 'lg',
                    size: 'lg',
                    resolve: {
                        entity: ['AlarmRule', function(AlarmRule) {
                            return AlarmRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-rule.new', {
            parent: 'alarm-rule',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-rule/alarm-rule-dialog.html',
                    controller: 'AlarmRuleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                description: null,
                                alarmType: 'KEYWORDS',
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
                    $state.go('alarm-rule', null, { reload: 'alarm-rule' });
                }, function() {
                    $state.go('alarm-rule');
                });
            }]
        })
        .state('alarm-rule.edit', {
            parent: 'alarm-rule',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-rule/alarm-rule-dialog.html',
                    controller: 'AlarmRuleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['AlarmRule', function(AlarmRule) {
                            return AlarmRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-rule', null, { reload: 'alarm-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('alarm-rule.delete', {
            parent: 'alarm-rule',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/alarm-rule/alarm-rule-delete-dialog.html',
                    controller: 'AlarmRuleDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['AlarmRule', function(AlarmRule) {
                            return AlarmRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('alarm-rule', null, { reload: 'alarm-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
