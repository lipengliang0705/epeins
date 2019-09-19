(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-rule', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('agent-rule', {
            title: '采集规则',
            url: '/agent-rule',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AgentRules'
            },
            templateUrl: 'app/pages/agent-rule/agent-rules.html',
            controller: 'AgentRuleController',
            controllerAs: 'vm',
            resolve: {
            },
            sidebarMeta: {
                order: 806,
             },
        })
        .state('agent-rule-detail', {
            parent: 'agent-rule',
            url: '/agent-rule/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'AgentRule'
            },
            // views: {
            //     'content@': {
            //         templateUrl: 'app/pages/agent-rule/agent-rule-detail.html',
            //         controller: 'AgentRuleDetailController',
            //         controllerAs: 'vm'
            //     }
            // },
            // resolve: {
            //     entity: ['$stateParams', 'AgentRule', function($stateParams, AgentRule) {
            //         return AgentRule.get({id : $stateParams.id}).$promise;
            //     }],
            //     previousState: ["$state", function ($state) {
            //         var currentStateData = {
            //             name: $state.current.name || 'agent-rule',
            //             params: $state.params,
            //             url: $state.href($state.current.name, $state.params)
            //         };
            //         return currentStateData;
            //     }]
            // }
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-detail.html',
                    controller: 'AgentRuleDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule-detail.edit', {
            parent: 'agent-rule-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-dialog.html',
                    controller: 'AgentRuleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new', {
            parent: 'agent-rule',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-dialog.html',
                    controller: 'AgentRuleDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        // .state('agent-rule.edit', {
        //     parent: 'agent-rule',
        //     url: '/{id}/edit',
        //     data: {
        //         authorities: ['ROLE_USER']
        //     },
        //     onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
        //         $uibModal.open({
        //             templateUrl: 'app/pages/agent-rule/agent-rule-dialog.html',
        //             controller: 'AgentRuleDialogController',
        //             controllerAs: 'vm',
        //             backdrop: 'static',
        //             size: 'lg',
        //             resolve: {
        //                 entity: ['AgentRule', function(AgentRule) {
        //                     return AgentRule.get({id : $stateParams.id}).$promise;
        //                 }]
        //             }
        //         }).result.then(function() {
        //             $state.go('agent-rule', null, { reload: 'agent-rule' });
        //         }, function() {
        //             $state.go('^');
        //         });
        //     }]
        // })
        .state('agent-rule.new-flume', {
            parent: 'agent-rule',
            url: '/new/flume',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-flume-dialog.html',
                    controller: 'AgentRuleFlumeDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                // name: null,
                                // alias: null,
                                // ruleType: null,
                                // detail: null,
                                // sourceType: null,
                                // description: null,
                                // example: null,
                                // conf: null,
                                // topic: null,
                                // createdTime: null,
                                // createdBy: null,
                                // modifiedTime: null,
                                // modifiedBy: null,
                                // id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-flume', {
            parent: 'agent-rule',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-flume-dialog.html',
                    controller: 'AgentRuleFlumeDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-filebeat', {
            parent: 'agent-rule',
            url: '/new/filebeat',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-filebeat-dialog.html',
                    controller: 'AgentRuleFilebeatDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-filebeat', {
            parent: 'agent-rule',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-filebeat-dialog.html',
                    controller: 'AgentRuleFilebeatDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-metricbeat', {
            parent: 'agent-rule',
            url: '/new/metricbeat',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-metricbeat-dialog.html',
                    controller: 'AgentRuleMetricBeatDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-metricbeat', {
            parent: 'agent-rule',
            url: '/{id}/edit/metricbeat',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-metricbeat-dialog.html',
                    controller: 'AgentRuleMetricBeatDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash', {
            parent: 'agent-rule',
            url: '/new/logstash',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-dialog.html',
                    controller: 'AgentRuleLogStashDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash', {
            parent: 'agent-rule',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-dialog.html',
                    controller: 'AgentRuleLogStashDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash-data', {
            parent: 'agent-rule',
            url: '/new/logstash-data',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-data-dialog.html',
                    controller: 'AgentRuleLogStashDataDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash-data', {
            parent: 'agent-rule',
            url: '/{id}/edit-data',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-data-dialog.html',
                    controller: 'AgentRuleLogStashDataDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash-monitor', {
            parent: 'agent-rule',
            url: '/new/logstash-monitor',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-monitor-dialog.html',
                    controller: 'AgentRuleLogStashMonitorDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash-monitor', {
            parent: 'agent-rule',
            url: '/{id}/edit-monitor',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-monitor-dialog.html',
                    controller: 'AgentRuleLogStashMonitorDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash-custom', {
            parent: 'agent-rule',
            url: '/new/logstash-custom',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-custom-dialog.html',
                    controller: 'AgentRuleLogStashCustomDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash-custom', {
            parent: 'agent-rule',
            url: '/{id}/edit-custom',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-custom-dialog.html',
                    controller: 'AgentRuleLogStashCustomDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash-tcp', {
            parent: 'agent-rule',
            url: '/new/logstash-tcp',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-tcp-dialog.html',
                    controller: 'AgentRuleLogStashTcpDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash-tcp', {
            parent: 'agent-rule',
            url: '/{id}/edit-tcp',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-tcp-dialog.html',
                    controller: 'AgentRuleLogStashTcpDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        //部署
        .state('agent-rule.deploy', {
            parent: 'agent-rule',
            url: '/deploy',
            params: {
                hosts: []
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-deploy-dialog.html',
                    controller: 'AgentRuleDeployController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['$stateParams', function($stateParams) {
                            return $stateParams;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash-file', {
            parent: 'agent-rule',
            url: '/new/logstash-file',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-file-dialog.html',
                    controller: 'AgentRuleLogStashFileDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash-file', {
            parent: 'agent-rule',
            url: '/{id}/edit-file',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-file-dialog.html',
                    controller: 'AgentRuleLogStashFileDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash-kafka', {
            parent: 'agent-rule',
            url: '/new/logstash-kafka',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-kafka-dialog.html',
                    controller: 'AgentRuleLogStashKafkaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash-kafka', {
            parent: 'agent-rule',
            url: '/{id}/edit-kafka',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-kafka-dialog.html',
                    controller: 'AgentRuleLogStashKafkaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.new-logstash-syslog', {
            parent: 'agent-rule',
            url: '/new/logstash-syslog',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-syslog-dialog.html',
                    controller: 'AgentRuleLogStashSyslogDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                alias: null,
                                ruleType: null,
                                detail: null,
                                sourceType: null,
                                description: null,
                                example: null,
                                conf: null,
                                topic: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: true });
                }, function() {
                    $state.go('agent-rule');
                });
            }]
        })
        .state('agent-rule.edit-logstash-syslog', {
            parent: 'agent-rule',
            url: '/{id}/edit-syslog',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-logstash-syslog-dialog.html',
                    controller: 'AgentRuleLogStashSyslogDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.delete', {
            parent: 'agent-rule',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-delete-dialog.html',
                    controller: 'AgentRuleDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['AgentRule', function(AgentRule) {
                            return AgentRule.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('agent-rule.batch', {
            parent: 'agent-rule',
            url: '/batch/{type}',
            params: {
                hosts: []
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/agent-rule/agent-rule-batch-dialog.html',
                    controller: 'AgentRuleBatchController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['$stateParams', function($stateParams) {
                            return $stateParams;
                        }]
                    }
                }).result.then(function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                }, function() {
                    $state.go('agent-rule', null, { reload: 'agent-rule' });
                });
            }]
        });
    }

})();
