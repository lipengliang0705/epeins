(function () {
    'use strict';

    angular
        .module('LoginsightUiApp.page.dashboard-builder', ['LoginsightUiApp'])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider
            .state('dashboards', {
                url: '/dashboards',
                templateUrl: 'app/pages/dashboard-builder/dashboards.html',
                controller: 'DashboardsController',
                controllerAs: 'vm',
                title: "自定义展现" 
            })
            .state('dashboard-builder', { 
                url: '/dashboard-builder/{id}',
                templateUrl: 'app/pages/dashboard-builder/builder.html',
                controller: 'BuilderCtrl',
                controllerAs: 'vm' 
            })
            .state('dashboard-detail', {
                url: '/dashboard-detail/{id}',
                templateUrl: 'app/pages/dashboard-builder/dashboard-detail.html',
                controller: 'DashboardDetailController',
                controllerAs: 'vm' 
            })
            .state('dashboards.delete', {
                parent: 'dashboards',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER','ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/pages/dashboard-builder/dashboard-delete-dialog.html',
                        controller: 'DashboardDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['DataDashboard', function(DataDashboard) {
                                return DataDashboard.get({id : $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function() {
                        $state.go('dashboards', null, { reload: 'dashboards' });
                    }, function() {
                        $state.go('^');
                    });
                }]
            });
    }

})();

 