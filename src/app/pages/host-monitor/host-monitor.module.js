(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.host-monitor', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('host-monitor', {
            url: '/host-monitor/:agentId',
            templateUrl: 'app/pages/host-monitor/host-monitor.html',
            controller: 'HostMonitorController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
