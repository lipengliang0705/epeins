(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.trouble-shooter', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('trouble-shooter', { 
            url: '/trouble-shooter',
            templateUrl: 'app/pages/trouble-shooter/trouble-shooter.html',
            controller: 'TroubleShooterController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
