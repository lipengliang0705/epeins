(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.system-monitor', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('system-monitor', { 
            url: '/system-monitor/',
            templateUrl: 'app/pages/system-monitor/system-monitor.html',
            controller: 'SystemMonitorController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
