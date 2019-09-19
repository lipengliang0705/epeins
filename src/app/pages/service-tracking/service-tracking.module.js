(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.service-tracking', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('service-tracking', { 
            url: '/service-tracking',
            templateUrl: 'app/pages/service-tracking/service-tracking.html',
            controller: 'ServiceTrackingController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
