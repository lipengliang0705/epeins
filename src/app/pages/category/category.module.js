(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.category', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('category', {
            title: '业务管理',
            url: '/category',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Categories'
            },
            templateUrl: 'app/pages/category/categories.html',
            controller: 'CategoryController',
            controllerAs: 'vm',
            resolve: {
            },
            sidebarMeta: {
                order: 806
            },
        })
        .state('category-detail', {
            parent: 'category',
            url: '/category/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Category'
            },
            // views: {
            //     'content@': {
            //         templateUrl: 'app/pages/category/category-detail.html',
            //         controller: 'CategoryDetailController',
            //         controllerAs: 'vm'
            //     }
            // },
            // resolve: {
            //     entity: ['$stateParams', 'Category', function($stateParams, Category) {
            //         return Category.get({id : $stateParams.id}).$promise;
            //     }],
            //     previousState: ["$state", function ($state) {
            //         var currentStateData = {
            //             name: $state.current.name || 'category',
            //             params: $state.params,
            //             url: $state.href($state.current.name, $state.params)
            //         };
            //         return currentStateData;
            //     }]
            // }
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/category/category-detail.html',
                    controller: 'CategoryDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['Category', function(Category) {
                            return Category.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('category-detail.edit', {
            parent: 'category-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/category/category-dialog.html',
                    controller: 'CategoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['Category', function(Category) {
                            return Category.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('category.new', {
            parent: 'category',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/category/category-dialog.html',
                    controller: 'CategoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                title: null,
                                description: null,
                                createdTime: null,
                                createdBy: null,
                                modifiedTime: null,
                                modifiedBy: null,
                                id: null
                            };
                        },                        
                        tagList: ['Tag', function(Tag) {
                            return Tag.getTagsAlias({name : 'category'}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('category', null, { reload: 'category' });
                }, function() {
                    $state.go('category');
                });
            }]
        })
        .state('category.edit', {
            parent: 'category',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/category/category-dialog.html',
                    controller: 'CategoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['Category', function(Category) {
                            return Category.get({id : $stateParams.id}).$promise;
                        }],                        
                        tagList: ['Tag', function(Tag) {
                            return Tag.getTagsAlias({name : 'category'}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('category', null, { reload: 'category' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('category.delete', {
            parent: 'category',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/pages/category/category-delete-dialog.html',
                    controller: 'CategoryDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['Category', function(Category) {
                            return Category.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('category', null, { reload: 'category' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
