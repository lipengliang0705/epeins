(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.agent-monitor', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('agent-monitor', { 
            url: '/agent-monitor',
            templateUrl: 'app/pages/agent-monitor/agent-monitor.html',
            controller: 'AgentMonitorController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
