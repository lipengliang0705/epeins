(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.spl-sql-search', ['LoginsightUiApp.page.logSearch'])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('spl-sql-search', { 
            url: '/spl-sql-search',
            templateUrl: 'app/pages/spl-sql-search/spl-sql-search.html',
            controller: 'SplSqlSearchController',
            controllerAs: 'vm',
            resolve: {
            }  
        })
        .state('spl-saveAs', {
                parent: 'spl-sql-search',
                url: '/spl-saveAs',
                params: {
                    data: {}
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/pages/spl-sql-search/spl-sql-search-saveAs.html',
                        controller: 'splSqlSearchSaveAsCtrl',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            data : $stateParams
                        }
                    }).result.then(function () {
                        $state.go('^', null, { reload: false });
                    }, function () {
                        $state.go('^');
                    })
                }]
            })
            .state('spl-data-dashboard', {
                parent: 'spl-sql-search',
                url: '/spl-data-dashboard', 
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    console.log('$stateParams', $stateParams);
                    $uibModal.open({
                        templateUrl: 'app/pages/data-dashboard/data-dashboard.html',
                        controller: 'DataDashboardCtrl',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            data : {'type': 'sql_spl'}
                        }
                    }).result.then(function () {
                        $state.go('^', null, { reload: true });
                    }, function () {
                        $state.go('^');
                    })
                }]
            }); 
    }

})();
