(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.spark-monitor', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('spark-monitor', { 
            url: '/spark-monitor',
            templateUrl: 'app/pages/spark-monitor/spark-monitor.html',
            controller: 'SparkMonitorController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
