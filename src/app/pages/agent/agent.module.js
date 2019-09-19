(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent', ['LoginsightUiApp.page.agent-host'])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('agent', {
            title: 'agent管理',
            url: '/agent',
            templateUrl: 'app/pages/agent/agents.html',
            controller: 'AgentController',
            controllerAs: 'vm',
            resolve: {
            },
            sidebarMeta: {
                order: 804,
            }
        })
        .state('agent-detail', {
            parent: 'agent',
            url: '/agent/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Agent'
            },
            // templateUrl: 'app/pages/agent/agent-detail.html',
            // controller: 'AgentDetailController',
            // controllerAs: 'vm' ,
            // resolve: {
            //     entity: ['$stateParams', 'Agent', function($stateParams, Agent) {
            //         return Agent.get({id : $stateParams.id}).$promise;
            //     }],
            //     previousState: ["$state", function ($state) {
            //         var currentStateData = {
            //             name: $state.current.name || 'agent',
            //             params: $state.params,
            //             url: $state.href($state.current.name, $state.params)
            //         };
            //         return currentStateData;
            //     }]
            // }
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent/agent-detail.html',
                    controller: 'AgentDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['Agent', function(Agent) {
                            return Agent.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-detail.edit', {
            parent: 'agent-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent/agent-dialog.html',
                    controller: 'AgentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['Agent', function(Agent) {
                            return Agent.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent.new', {
            parent: 'agent',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent/agent-dialog.html',
                    controller: 'AgentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                version: null,
                                sourcePath: null,
                                scriptPath: null,
                                description: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                createdTime: null,
                                createdBy: null,
                                status: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent', null, { reload: 'agent' });
                }, function() {
                    $state.go('agent');
                });
            }]
        })
        .state('agent.edit', {
            parent: 'agent',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent/agent-dialog.html',
                    controller: 'AgentDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['Agent', function(Agent) {
                            return Agent.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent', null, { reload: 'agent' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent.delete', {
            parent: 'agent',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent/agent-delete-dialog.html',
                    controller: 'AgentDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['Agent', function(Agent) {
                            return Agent.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent', null, { reload: 'agent' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
