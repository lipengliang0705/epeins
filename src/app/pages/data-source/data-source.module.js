(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-source', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('data-source', {
            title: '数据源',
            url: '/data-source',
            templateUrl: 'app/pages/data-source/data-sources.html',
            controller: 'DataSourceController',
            controllerAs: 'vm',
            resolve: {
            },
            sidebarMeta: {
            order: 803,
          },
        })
        .state('data-source-detail', {
            parent: 'data-source',
            url: '/data-source/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'DataSource'
            },
            // views: {
            //     'content@': {
            //         templateUrl: 'app/pages/data-source/data-source-detail.html',
            //         controller: 'DataSourceDetailController',
            //         controllerAs: 'vm'
            //     }
            // },
            // resolve: {
            //     entity: ['$stateParams', 'DataSource', function($stateParams, DataSource) {
            //         return DataSource.get({id : $stateParams.id}).$promise;
            //     }],
            //     previousState: ["$state", function ($state) {
            //         var currentStateData = {
            //             name: $state.current.name || 'data-source',
            //             params: $state.params,
            //             url: $state.href($state.current.name, $state.params)
            //         };
            //         return currentStateData;
            //     }]
            // }
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/data-source/data-source-detail.html',
                    controller: 'DataSourceDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['DataSource', function(DataSource) {
                            return DataSource.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('data-source-detail.edit', {
            parent: 'data-source-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/data-source/data-source-dialog.html',
                    controller: 'DataSourceDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['DataSource', function(DataSource) {
                            return DataSource.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('data-source.new', {
            parent: 'data-source',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/data-source/data-source-dialog.html',
                    controller: 'DataSourceDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                sourceType: null,
                                description: null,
                                url: null,
                                credential: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null,
                                alias:'主'
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('data-source', null, { reload: 'data-source' });
                }, function() {
                    $state.go('data-source');
                });
            }]
        })
        .state('data-source.edit', {
            parent: 'data-source',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/data-source/data-source-dialog.html',
                    controller: 'DataSourceDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['DataSource', function(DataSource) {
                            return DataSource.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('data-source', null, { reload: 'data-source' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('data-source.delete', {
            parent: 'data-source',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/data-source/data-source-delete-dialog.html',
                    controller: 'DataSourceDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['DataSource', function(DataSource) {
                            return DataSource.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('data-source', null, { reload: 'data-source' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
