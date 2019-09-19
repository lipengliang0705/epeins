(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.kafka-monitor', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('kafka-monitor', { 
            url: '/kafka-monitor',
            templateUrl: 'app/pages/kafka-monitor/kafka-monitor.html',
            controller: 'KafkaMonitorController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
