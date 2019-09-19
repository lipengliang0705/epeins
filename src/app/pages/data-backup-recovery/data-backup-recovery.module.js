(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.data-backup-recovery', [])
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) { 
        $stateProvider.state('data-backup-recovery', { 
            url: '/data-backup-recovery',
            templateUrl: 'app/pages/data-backup-recovery/data-backup-recovery.html',
            controller: 'DataBackupRecoveryController',
            controllerAs: 'vm',
            resolve: {
            }  
        });
    }

})();
