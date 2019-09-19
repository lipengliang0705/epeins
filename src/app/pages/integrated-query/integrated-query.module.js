(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.integrated-query', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('integrated-query', { 
            url: '/integrated-query',
            templateUrl: 'app/pages/integrated-query/integrated-query.html',
            controller: 'IntegratedQueryController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
