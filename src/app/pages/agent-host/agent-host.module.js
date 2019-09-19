(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-host', ['switcher', 'angularFileUpload'])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('agent-host', {
            title: '已知主机',
            url: '/agent-host',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AgentHosts'
            },
            templateUrl: 'app/pages/agent-host/agent-hosts.html',
            controller: 'AgentHostController',
            controllerAs: 'vm',
            resolve: {
            },
            sidebarMeta: {
            order: 805,
          },
        })
        .state('agent-host-detail', {
            parent: 'agent-host',
            url: '/agent-host/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AgentHost'
            },
            // templateUrl: 'app/pages/agent-host/agent-host-detail.html',
            // controller: 'AgentHostDetailController',
            // controllerAs: 'vm',
            // resolve: {
            //     entity: ['$stateParams', 'AgentHost', function($stateParams, AgentHost) {
            //         return AgentHost.get({id : $stateParams.id}).$promise;
            //     }],
            //     previousState: ["$state", function ($state) {
            //         var currentStateData = {
            //             name: $state.current.name || 'agent-host',
            //             params: $state.params,
            //             url: $state.href($state.current.name, $state.params)
            //         };
            //         return currentStateData;
            //     }]
            // }
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-host/agent-host-detail.html',
                    controller: 'AgentHostDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentHost', function(AgentHost) {
                            return AgentHost.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-host-detail.edit', {
            parent: 'agent-host-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-host/agent-host-dialog.html',
                    controller: 'AgentHostDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentHost', function(AgentHost) {
                            return AgentHost.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-host.new', {
            parent: 'agent-host',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-host/agent-host-dialog.html',
                    controller: 'AgentHostDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                ip: null,
                                osType: null,
                                loginType: null,
                                depolyPath: null,
                                // status: null,
                            };
                        },                        
                        tagList: ['Tag', function(Tag) {
                            return Tag.getTagsAlias({name : 'host'}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-host', null, { reload: 'agent-host' });
                }, function() {
                    $state.go('agent-host');
                });
            }]
        })
        .state('agent-host.edit', {
            parent: 'agent-host',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-host/agent-host-dialog.html',
                    controller: 'AgentHostDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentHost', function(AgentHost) {
                            return AgentHost.get({id : $stateParams.id}).$promise;
                        }],                        
                        tagList: ['Tag', function(Tag) {
                            return Tag.getTagsAlias({name : 'host'}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-host', null, { reload: 'agent-host' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-host.delete', {
            parent: 'agent-host',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-host/agent-host-delete-dialog.html',
                    controller: 'AgentHostDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['AgentHost', function(AgentHost) {
                            return AgentHost.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-host', null, { reload: 'agent-host' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-host.deploy', {
            parent: 'agent-host',
            url: '/deploy',
            params: {
                hosts: []
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-host/agent-host-deploy-dialog.html',
                    controller: 'AgentHostDeployController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['$stateParams', function($stateParams) {
                            return $stateParams;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-host', null, { reload: 'agent-host' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-host.multiple', {
            parent: 'agent-host',
            url: '/multiple',
            params: {
                hosts: []
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-host/agent-host-multiple-dialog.html',
                    controller: 'AgentHostMultipleController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['$stateParams', function($stateParams) {
                            return $stateParams;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-host', null, { reload: 'agent-host' });
                }, function() {
                    $state.go('agent-host', null, { reload: 'agent-host' });
                });
            }]
        })
    }

})();
