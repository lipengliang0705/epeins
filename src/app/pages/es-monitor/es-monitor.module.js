(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.es-monitor', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('es-monitor', { 
            url: '/es-monitor',
            templateUrl: 'app/pages/es-monitor/es-monitor.html',
            controller: 'EsMonitorController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
